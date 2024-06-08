import { ChainId, Currency, Ether, NativeCurrency, Token } from '@uniswap/sdk-core';
import invariant from 'tiny-invariant';

import { WRAPPED_NATIVE_CURRENCY } from '../constants/tokens-uniswap';

export function isPolygon(chainId: number): chainId is ChainId.POLYGON | ChainId.POLYGON_MUMBAI {
  return chainId === ChainId.POLYGON_MUMBAI || chainId === ChainId.POLYGON;
}

class PolygonNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }

  get wrapped(): Token {
    if (!isPolygon(this.chainId)) throw new Error('Not Polygon');
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId];
    invariant(wrapped instanceof Token);
    return wrapped;
  }

  public constructor(chainId: number) {
    if (!isPolygon(chainId)) throw new Error('Not Polygon');
    super(chainId, 18, 'MATIC', 'Matic');
  }
}

class ExtendedEther extends Ether {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId];
    if (wrapped) return wrapped;
    throw new Error(`Unsupported chain ID: ${this.chainId}`);
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {};

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId));
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {};
export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId];
  let nativeCurrency: NativeCurrency | Token;
  if (isPolygon(chainId)) {
    nativeCurrency = new PolygonNativeCurrency(chainId);
  } else {
    nativeCurrency = ExtendedEther.onChain(chainId);
  }
  return (cachedNativeCurrency[chainId] = nativeCurrency);
}
