const parseRangeValues = (lines, start, end) => {
  start = parseInt(start);
  if (end === 'EOF') {
    end = lines.length;
  } else {
    end = parseInt(end || start);
  }
  return [start, end];
}

const validateRange = (lines, start, end) => {
  if (start > lines.length) {
    throw new RangeError(`invalid line range: start of range ${start} is greater than file size of ${lines.length} lines`);
  }
  if (end > lines.length) {
    throw new RangeError(`invalid line range: end of range ${end} is greater than file size of ${lines.length - 1} lines`);
  }
  if (end < start) {
    throw new RangeError(`invalid line range: end of range ${end} is not >= start of range ${start}`);
  }
}

const getFileSlice = (lines, start, end) => {
  validateRange(lines, start, end);
  return lines.slice(start - 1, end).join('\n');
}

module.exports = {
  parseRangeValues: parseRangeValues,
  getFileSlice: getFileSlice,
}