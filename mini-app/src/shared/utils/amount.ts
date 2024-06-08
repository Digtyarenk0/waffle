import { BigNumber } from '@ethersproject/bignumber';
import Big, { BigSource } from 'big.js';

export type NumSource = (BigSource | BigNumber) & { type?: string; hex?: string };

export function toNumber(value: NumSource): number {
  if (typeof value == 'number') return value;
  if (typeof value == 'string') return Number(value);

  return value.toNumber();
}

export function amountToWei(amount: NumSource, decimal: NumSource): Big {
  return Big(
    Big(amount.toString())
      .times(Big(10).pow(toNumber(decimal)))
      .toFixed(0),
  );
}

export function weiToAmount(amount: NumSource, decimal: NumSource): Big {
  return Big(amount.toString()).div(Big(10).pow(toNumber(decimal)));
}
