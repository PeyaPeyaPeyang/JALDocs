import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const core = createRequire(require.resolve("@docusaurus/core/package.json"));
const loader = createRequire(core.resolve("@docusaurus/mdx-loader"));
const cjs = loader.resolve("image-size");
const esm = cjs.replace(/\.cjs$/, ".mjs");
function box(type, payload = Buffer.alloc(0), size) {
  const bytes = Buffer.alloc(8 + payload.length);
  bytes.writeUInt32BE(size ?? bytes.length, 0);
  bytes.write(type, 4, 4, "ascii");
  payload.copy(bytes, 8);
  return bytes;
}
const icns = Buffer.concat([
  Buffer.from("icns"),
  Buffer.from([0, 0, 0, 16]),
  Buffer.from("ic07"),
  Buffer.alloc(4),
]);
const jxl = Buffer.concat([
  box("JXL ", Buffer.from([13, 10, 135, 10])),
  box("ftyp", Buffer.from("jxl ")),
  box("jxlp", Buffer.alloc(4), 0),
]);
const ispe = box("ispe", Buffer.alloc(12), 0);
const heif = Buffer.concat([
  box("ftyp", Buffer.from("heic")),
  box("meta", Buffer.concat([Buffer.alloc(4), box("iprp", box("ipco", ispe))])),
]);
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aRZsAAAAASUVORK5CYII=",
  "base64",
);
for (const modulePath of [cjs, esm]) {
  for (const [name, bytes, valid] of [
    ["ICNS", icns, false],
    ["JXL", jxl, false],
    ["HEIF", heif, false],
    ["PNG", png, true],
  ]) {
    const code = `import {imageSize} from ${JSON.stringify(pathToFileURL(modulePath).href)};
      try { const size = imageSize(Buffer.from(${JSON.stringify(bytes.toString("base64"))}, 'base64'));
        if (${valid} && (size.width !== 1 || size.height !== 1)) process.exit(2);
      } catch (error) { if (${valid}) throw error; }`;
    const result = spawnSync(
      process.execPath,
      ["--input-type=module", "--eval", code],
      { timeout: 3000, encoding: "utf8", windowsHide: true },
    );
    assert.equal(
      result.status,
      0,
      `${name} (${modulePath}): ${result.error ?? result.stderr}`,
    );
  }
}
console.log("Image parser regression checks passed (CommonJS and ESM).");
