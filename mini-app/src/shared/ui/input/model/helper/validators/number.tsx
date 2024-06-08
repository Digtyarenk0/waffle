export const maxDecimalsInput = (e: React.ChangeEvent<HTMLInputElement>, decimals = 0) => {
  const v = e.target.value;
  const indexDot = v.indexOf('.');
  const indexComma = v.indexOf(',');
  const index = indexDot >= 0 ? indexDot : indexComma;
  const isDecimals = index >= 0;
  if (isDecimals) {
    const value = v.substr(0, index) + v.substr(index, decimals + 1);
    return value;
  }
  return null;
};

export const onKeyDownOnlyNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const isSymbol = ['e', 'E', '+', '-'].includes(e.key);
  const isCtrlV = e.code === 'KeyV';
  (isSymbol || isCtrlV) && e.preventDefault();
};
