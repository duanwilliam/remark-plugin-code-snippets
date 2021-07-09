const minIndent = (text) => {
  const matches = text.match(/^[ \t]*(?=\S)/gm);
  return matches?.reduce((accum, match) => Math.min(accum, match), Infinity);
}

const stripIndent = (text) => {
  const indentLevel = minIndent(text);
  if(indentLevel === 0) return text;
  return text.replace(new RegExp(`^[ \t]{${indentLevel}}`, 'gm'), '');
}

module.exports = stripIndent;