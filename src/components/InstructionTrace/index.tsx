import type {ReactNode} from 'react';
import {Prism, normalizeTokens, type Token} from 'prism-react-renderer';

import '@site/src/prism/jal';
import styles from './styles.module.css';

export type TraceLine = {
  code: string;
  stack: string[];
  locals: string[];
};

type InstructionTraceProps =
  | {
      lines: TraceLine[];
      code?: never;
      states?: never;
      trace?: never;
    }
  | {
      trace: string;
      lines?: never;
      code?: never;
      states?: never;
    }
  | {
      code: string;
      states: string;
      lines?: never;
      trace?: never;
    };

function trimBlankEdges(lines: string[]): string[] {
  const result = [...lines];

  while (result[0]?.trim() === '') {
    result.shift();
  }

  while (result.at(-1)?.trim() === '') {
    result.pop();
  }

  return result;
}

function leadingWhitespaceWidth(line: string): number {
  return [...(line.match(/^\s*/)?.[0] ?? '')].reduce(
    (width, char) => width + (char === '\t' ? 2 : 1),
    0,
  );
}

function removeLeadingWhitespace(line: string, width: number): string {
  let remainingWidth = width;
  let index = 0;

  while (remainingWidth > 0 && index < line.length) {
    const char = line[index];

    if (char !== ' ' && char !== '\t') {
      break;
    }

    remainingWidth -= char === '\t' ? 2 : 1;
    index += 1;
  }

  return line.slice(index);
}

function dedent(lines: string[]): string[] {
  const indents = lines
    .filter((line) => line.trim() !== '')
    .map((line) => leadingWhitespaceWidth(line));
  const commonIndent = Math.min(...indents, 0);

  if (commonIndent === 0) {
    return lines;
  }

  return lines.map((line) =>
    line.trim() === '' ? line : removeLeadingWhitespace(line, commonIndent),
  );
}

function parseStateItems(text?: string): string[] {
  const value = text?.trim();

  if (!value || value === '-' || value === '[]') {
    return [];
  }

  const listText =
    value.startsWith('[') && value.endsWith(']') ? value.slice(1, -1) : value;

  return listText
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseTraceLines(code: string, states: string): TraceLine[] {
  const codeLines = dedent(trimBlankEdges(code.replace(/\r\n/g, '\n').split('\n')));
  const stateLines = trimBlankEdges(states.replace(/\r\n/g, '\n').split('\n'));

  return codeLines.map((codeLine, index) => {
    const [stack, locals] = stateLines[index]?.split('|') ?? [];

    return {
      code: codeLine,
      stack: parseStateItems(stack),
      locals: parseStateItems(locals),
    };
  });
}

function parseTraceTable(trace: string): TraceLine[] {
  const traceLines = dedent(trimBlankEdges(trace.replace(/\r\n/g, '\n').split('\n')));

  const lines: TraceLine[] = [];

  for (let index = 0; index < traceLines.length; index += 1) {
    const traceLine = traceLines[index];
    const nextLine = traceLines[index + 1];
    const stateLine = nextLine?.match(/^\s*↑\s*(.*)$/u)?.[1];

    if (stateLine !== undefined) {
      const [stack, locals] = stateLine.split('|');

      lines.push({
        code: traceLine.trimEnd(),
        stack: parseStateItems(stack),
        locals: parseStateItems(locals),
      });

      index += 1;
      continue;
    }

    const [code = '', stack, locals] = traceLine.split('|');

    lines.push({
      code: code.trimEnd(),
      stack: parseStateItems(stack),
      locals: parseStateItems(locals),
    });
  }

  return lines;
}

function stateTypeOf(item: string): string {
  const value = item.toLowerCase();

  if (/\bstring\b|".*"/.test(value)) {
    return styles.typeReference;
  }

  if (/\bint\b|\bi\b|(^|[^a-z])\d+([^a-z]|$)|\barg\d+\b|count|value/.test(value)) {
    return styles.typeInt;
  }

  if (/\blong\b|\bj\b|0-1:|1-2:/.test(value)) {
    return styles.typeLong;
  }

  if (/\bthis\b|system\.out|printstream|object|\[/.test(value)) {
    return styles.typeReference;
  }

  return styles.typeUnknown;
}

function StateList({items, emptyLabel}: {items: string[]; emptyLabel: string}): ReactNode {
  if (items.length === 0) {
    return <span className={styles.empty}>{emptyLabel}</span>;
  }

  return (
    <ol className={styles.stateList}>
      {items.map((item, index) => (
        <li className={stateTypeOf(item)} key={`${item}-${index}`}>
          <code>{item}</code>
        </li>
      ))}
    </ol>
  );
}

function renderToken(token: Token, index: number): ReactNode {
  return (
    <span className={`token ${token.types.join(' ')}`} key={`${token.content}-${index}`}>
      {token.content}
    </span>
  );
}

function highlightJalLine(code: string): Token[] {
  const grammar = Prism.languages.jal;

  if (grammar === undefined) {
    return [{content: code, types: ['plain']}];
  }

  return normalizeTokens(Prism.tokenize(code, grammar))[0] ?? [];
}

function InstructionText({code}: {code: string}): ReactNode {
  const indentWidth = leadingWhitespaceWidth(code);
  const text = code.replace(/^\s*/, '') || ' ';
  const tokens = highlightJalLine(text);

  return (
    <span className={styles.instruction} style={{paddingInlineStart: `${indentWidth}ch`}}>
      <span className={styles.instructionContent}>{tokens.map(renderToken)}</span>
    </span>
  );
}

export default function InstructionTrace(props: InstructionTraceProps): ReactNode {
  const lines =
    props.lines !== undefined
      ? props.lines
      : props.trace !== undefined
        ? parseTraceTable(props.trace)
        : parseTraceLines(props.code, props.states);

  return (
    <div className={styles.trace}>
      <pre className={styles.codeBlock}>
        <code>
          {lines.map((line, index) => (
            <span className={styles.line} key={`${line.code}-${index}`} tabIndex={0}>
              <span className={styles.lineNumber}>{index + 1}</span>
              <InstructionText code={line.code} />
              {(line.stack.length > 0 || line.locals.length > 0) &&
                !/^\s*(?:public|private|protected|static|[ialfd]?return)\b|:\s*$|^\s*[{}]\s*$/.test(line.code) && (
              <span className={styles.tooltip} role="tooltip">
                <span className={styles.tooltipTitle}>実行後の状態</span>
                <span className={styles.stateGrid}>
                  <span>
                    <span className={styles.stateLabel}>スタック</span>
                    <StateList items={line.stack} emptyLabel="空" />
                  </span>
                  <span>
                    <span className={styles.stateLabel}>ローカル変数</span>
                    <StateList items={line.locals} emptyLabel="なし" />
                  </span>
                </span>
              </span>
              )}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
