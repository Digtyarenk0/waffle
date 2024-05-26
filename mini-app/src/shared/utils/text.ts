export const truncateMiddle = (name: string, beforeLength = 7, afterLength = 7) => {
  const { length } = name;
  if (beforeLength + afterLength >= length) {
    return name;
  }
  const before = name.substring(0, beforeLength);
  const after = name.substring(length - afterLength, length);
  return `${before}...${after}`;
};
