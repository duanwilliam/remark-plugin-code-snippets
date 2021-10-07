const minIndent = (text: string, tabSize: number = 4) => {
  const matches = text.match(/^[ \t]*(?=\S)/gm);
  return matches?.reduce((accum, match) => Math.min(accum, match.length), Infinity);
}

export const stripIndent = (text: string, tabSize: number = 4) => {
  const indentLevel = minIndent(text, tabSize);
  if(indentLevel === 0) return text;
  return text.replace(new RegExp(`^[ \t]{${indentLevel}}`, 'gm'), '');
}

const onlyWhitespaceRegex = /^\s*$/;
const trimLeadingNewlinesRegex = /^[\r\n]+/g;
const trimTrailingNewlinesRegex = /[\r\n]+$/g;
const trimLeadingTrailingNewlinesRegex = /^[\r\n]+|[\r\n]+$/g;

export const isOnlyWhitespace = (text: string) => onlyWhitespaceRegex.test(text);

export const getTrimFunc = (trim: boolean | 'leading' | 'trailing', normalizeIndent: boolean) => {
  const func = (text: string) => {
    if (trim === false) {
      return text;
    }
    const regex = (trim === true)
      ? trimLeadingTrailingNewlinesRegex
      : (trim === 'leading')
        ? trimLeadingNewlinesRegex
        : (trim === 'trailing')
          ? trimTrailingNewlinesRegex
          : undefined;
    
    return text.replace(regex, '');
  }
  if (normalizeIndent) {
    return (text: string) => stripIndent(func(text));
  }
  return func;
};