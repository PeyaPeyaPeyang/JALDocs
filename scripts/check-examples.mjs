/** Validate complete JAL classes and method examples with the local LangJAL CLI.
 * LANGJAL_CLASSPATH must contain the freshly built compiler and its dependencies.
 * Instruction fragments and deliberately incomplete text fences are excluded.
 */
import {readFile, readdir, mkdir, writeFile, mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const cp = process.env.LANGJAL_CLASSPATH;
if (!cp) throw new Error('Set LANGJAL_CLASSPATH to the built LangJAL CLI classpath.');
const java = process.env.JAVA_HOME ? join(process.env.JAVA_HOME, 'bin', 'java') : 'java';
const temporary = await mkdtemp(join(tmpdir(), 'langjal-doc-examples-'));
let checked = 0, fragments = 0;
const failures = [];
async function* files(dir) {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (/\.mdx?$/.test(path)) yield path;
  }
}
try {
  const verifier = join(temporary, 'Verify.java');
  await writeFile(verifier, `import java.net.*; import java.nio.file.*;
class Verify { public static void main(String[] args) throws Exception {
 try (var loader = new URLClassLoader(new URL[]{Path.of(args[0]).toUri().toURL()})) {
  for (String name : args[1].split(",")) Class.forName(name, false, loader).getDeclaredMethods();
 }
}}`);
  async function* inputs() { yield* files(resolve('docs')); yield resolve('src/pages/index.tsx'); }
  for await (const path of inputs()) {
    let text = await readFile(path, 'utf8');
    if (path.endsWith('.tsx')) text = text.replace(/const \w+Trace = `([\s\S]*?)`;/g, (_, trace) => '```jal\n' + trace.split('\n').filter(line => !/^\s*↑/.test(line)).join('\n') + '\n```');
    for (const match of text.matchAll(/^```jal\s*\n([\s\S]*?)^```/gm)) {
      let source = match[1];
      const isClass = /\b(?:class|interface)\s+\S+\s*(?:\(|\{)/.test(source);
      if (!isClass && !/^\s*(?:public|private|protected|static)\b[^\n]*\([^\n]*\)[^\n]*\{/m.test(source)) {
        fragments++;
        continue;
      }
      const number = ++checked;
      if (!isClass) source = `public class DocExample${number} (major_version=55, minor_version=0) {\n${source}\n}`;
      const directory = join(temporary, String(number));
      await mkdir(directory);
      const input = join(directory, 'Example.jal'), output = join(directory, 'classes');
      await writeFile(input, source);
      const result = spawnSync(java, ['-cp', cp, 'tokyo.peya.langjal.cli.Main', input, '--output', output], {encoding: 'utf8', windowsHide: true});
      const names = [];
      async function collect(dir, prefix = '') {
        for (const entry of await readdir(dir, {withFileTypes: true})) {
          if (entry.isDirectory()) await collect(join(dir, entry.name), prefix + entry.name + '.');
          else if (entry.name.endsWith('.class')) names.push(prefix + entry.name.slice(0,-6));
        }
      }
      await collect(output).catch(() => {});
      const line = text.slice(0, match.index).split('\n').length;
      if (result.status !== 0 || !names.length) { failures.push(`${path}:${line}\n${result.stdout}\n${result.stderr}`); continue; }
      const verify = spawnSync(java, ['-Xverify:all', verifier, output, names.join(',')], {encoding: 'utf8', windowsHide: true});
      if (verify.status !== 0) { failures.push(`${path}:${line}\n${verify.stdout}\n${verify.stderr}`); continue; }
      const expected = {Sum: '55', Add: '5', LookupDemo: '1'}[names[0]];
      if (expected !== undefined) {
        const run = spawnSync(java, ['-Xverify:all', '-cp', output, names[0]], {encoding:'utf8', windowsHide:true, timeout:10000});
        if (run.status !== 0 || run.stdout.trim() !== expected) { failures.push(`${path}:${line} expected ${expected}: ${run.stdout} ${run.stderr}`); continue; }
      }
      console.log(`OK ${path}:${line}`);
    }
  }
  if (failures.length) throw new Error(failures.join("\n\n"));
  console.log(`${checked} examples compiled and JVM-verified; ${fragments} instruction fragments excluded.`);
} finally {
  await rm(temporary, {recursive: true, force: true});
}
