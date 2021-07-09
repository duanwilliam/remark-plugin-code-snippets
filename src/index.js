const fs = require('fs');
const path = require('path');

const stripIndent = require('./indent');
const { parseRangeValues, getFileSlice } = require('./range');
const {
  isOnlyWhitespace,
  trimLeadingNewlines,
  trimTrailingNewlines,
  trimLeadingTrailingNewlines,
} = require('./whitespace');


const fileRegex = /file=(["'])(?<file>.*?)\1(?::(?<start>[1-9]\d*)(?:-(?<end>[1-9]\d*|EOF))?)?/;
const insertFileContentsRegex = /^[^\S\r\n]*{{[^\S\r\n]FILE(?::(?<start>[1-9]\d*)(?:-(?<end>[1-9]\d*|EOF))?)?[^\S\r\n]}}[^\S\r\n]*$/gm;

const trimToOptions = (text, {trim, normalizeIndent}) => {
  const trimFunction = (trim === true)
      ? trimLeadingTrailingNewlines
      : (trim === 'leading')
        ? trimLeadingNewlines
        : (trim === 'trailing')
          ? trimTrailingNewlines
          : (text) => text;
  text = trimFunction(text);
  if (normalizeIndent) {
    return stripIndent(text);
  }
  return text;
}

const transformNode = (node, { basePath, ...trimOptions }) => {
  const fileMatch = node.meta?.match(fileRegex);
  if(!fileMatch) return;
  const { file, start: stringStart, end: stringEnd } = fileMatch.groups;
  let fileContent;
  try {
    fileContent = fs.readFileSync(
      path.resolve(basePath, file),
      { encoding: 'utf8', },
    ).toString();
  } catch(e) {
    console.log(e);
    fileContent = `Failed to load contents from file ${file}`;
  }

  const lines = fileContent.split('\n');

  node.value = trimToOptions((() => {
    if (stringStart) {
      const [start, end] = parseRangeValues(lines, stringStart, stringEnd);
      return getFileSlice(lines, start, end);
    }
    if (insertFileContentsRegex.test(node.value)) {
      return node.value.replace(insertFileContentsRegex, (...args) => {
          const [match, p1, p2, o, s, groups] = args;
          const { start: stringStart, end: stringEnd } = groups;
          if(!stringStart) return fileContent;
          const [start, end] = parseRangeValues(lines, stringStart, stringEnd);
          return getFileSlice(lines, start, end);
        });
    }
    if (!isOnlyWhitespace(node.value)) {
      console.log(`WARNING: file ${path.resolve(basePath, file)} is sourced but not used anywhere.`);
    }
    return fileContent;
  })(), trimOptions);
}

const attacher = (options = {}) => {
  const {
    basePath = '.',
    trim = true,
    normalizeIndent = true,
  } = options;
  
  options = {
    basePath: basePath,
    trim: trim,
    normalizeIndent: normalizeIndent,
  };

  const transformer = (node) => {
    if (node.type === 'code') {
      transformNode(node, options);
      return undefined;
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        transformer(child);
      }
    }
    return undefined;
  };
  return transformer;
};

module.exports = attacher;