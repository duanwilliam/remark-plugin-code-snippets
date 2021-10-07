import type { Plugin, Transformer } from 'unified';
import type { MDASTNode } from '../common/types';
import type { Options } from './types';

import * as fs from 'fs';
import * as path from 'path';

import { isOnlyWhitespace, getTrimFunc } from './utils/whitespace';
import { codeSnippetRegex } from '../common/codeSnippetRegex';

import inferLanguage from '../infer-language';

const insertFileContentsRegex = /^[^\S\r\n]*{{[^\S\r\n]FILE(?::(?<start>[1-9]\d*)(?:-(?<end>[1-9]\d*))?)?[^\S\r\n]}}[^\S\r\n]*$/gm;

const fileExists = async (path: string) => await fs.promises.access(path).then(() => true).catch(() => false);

const getFileSlice = (
  content: string,
  lines: string[],
  start: string | undefined,
  end: string,
  dash: string | undefined,
) => {
  if (start === undefined) { return content; }

  const s = Math.max(1, parseInt(start));
  const e = (end !== undefined)
    ? Math.min(lines.length, parseInt(end || start))
      : dash
        ? s
        : undefined
  ;

  return lines.slice(s - 1, e).join('\n');
}

type TransformNodeOptions = Required<Pick<Options, 'basePath'>> & { trim: (text: string) => string; }

const transformNode = async (
  node: MDASTNode,
  sourceFile: Parameters<Transformer>[1],
  {
    basePath,
    trim,
  }: TransformNodeOptions,
) => {
  basePath = basePath ?? (sourceFile.dirname || '');

  const groups = node.meta?.match(codeSnippetRegex)?.groups;
  if (!groups) { return; }

  const { file, start, end, dash } = groups;

  const filepath = path.resolve(basePath, file);

  if(!await fileExists(filepath)) {
    // console.log(`file ${file} does not exist.`);
    return;
  }

  const fileContent = await fs.promises.readFile(
    filepath,
    { encoding: 'utf8', },
  ).then((content) => content.toString());

  const newFileContent = (() => {
    const lines = fileContent.split('\n');
    if (isOnlyWhitespace(node.value)) {
      return getFileSlice(fileContent, lines, start, end, dash);
    }
    return node.value.replace(insertFileContentsRegex, (...args) => {
      const [_match, _p1, _p2, _o, _str, groups] = args;
      const { start: embedStart, end: embedEnd, dash: embedDash } = groups;
      const [s, e] = embedStart === undefined ? [start, end] : [embedStart, embedEnd];
      return getFileSlice(fileContent, lines, s, e, embedDash);
    });
  })();

  node.value = trim(newFileContent);

  return true;
}

const attacher: Plugin = (options: Options = {}) => {
  const {
    basePath,
    trim = true,
    normalizeIndent = true,
  } = options;

  const resolvedOptions: TransformNodeOptions = {
    basePath,
    trim: getTrimFunc(trim, normalizeIndent),
  };

  const transformer: Transformer = async (node: MDASTNode, file) => {
    if (node.type === 'code') {
      await transformNode(node, file, resolvedOptions);
      return undefined;
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        await transformer(child, file, undefined);
      }
    }
    return undefined;
  };

  return transformer;
};

(attacher as any).inferLanguage = inferLanguage;

export default attacher;