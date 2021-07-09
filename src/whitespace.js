const onlyWhitespaceRegex = /^\s*$/;
const trimLeadingNewlinesRegex = /^[\r\n]+/g;
const trimTrailingNewlinesRegex = /[\r\n]+$/g;
const trimLeadingTrailingNewlinesRegex = /^[\r\n]+|[\r\n]+$/g;

const isOnlyWhitespace = (text) => onlyWhitespaceRegex.test(text);
const trimLeadingNewlines = (text) => text.replace(trimLeadingNewlinesRegex, '');
const trimTrailingNewlines = (text) => text.replace(trimTrailingNewlinesRegex, '');
const trimLeadingTrailingNewlines = (text) => text.replace(trimLeadingTrailingNewlinesRegex, '');

module.exports = {
  isOnlyWhitespace: isOnlyWhitespace,
  trimLeadingNewlines: trimLeadingNewlines,
  trimTrailingNewlines: trimTrailingNewlines,
  trimLeadingTrailingNewlines: trimLeadingTrailingNewlines,
}