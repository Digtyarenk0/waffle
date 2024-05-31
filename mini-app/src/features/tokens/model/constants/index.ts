export const UNI_LIST = 'https://cloudflare-ipfs.com/ipns/tokens.uniswap.org';
export const UNI_EXTENDED_LIST = 'https://cloudflare-ipfs.com/ipns/extendedtokens.uniswap.org';
const UNI_UNSUPPORTED_LIST = 'https://cloudflare-ipfs.com/ipns/unsupportedtokens.uniswap.org';
const AAVE_LIST = 'tokenlist.aave.eth';
const BA_LIST = 'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json';
const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json';
const COINGECKO_ARBITRUM_LIST = 'https://tokens.coingecko.com/arbitrum-one/all.json';
const COINGECKO_POLYGON_LIST = 'https://tokens.coingecko.com/polygon-pos/all.json';
const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json';
const WRAPPED_LIST = 'wrapped.tokensoft.eth';
export const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json';
export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST, UNI_UNSUPPORTED_LIST];
export const UNISWAP_TOKENS_LIST_URL = 'https://cloudflare-ipfs.com/ipns/tokens.uniswap.org';

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [UNI_LIST];
export const DEFAULT_INACTIVE_LIST_URLS: string[] = [
  UNI_EXTENDED_LIST,
  COMPOUND_LIST,
  AAVE_LIST,
  COINGECKO_LIST,
  COINGECKO_ARBITRUM_LIST,
  COINGECKO_POLYGON_LIST,
  WRAPPED_LIST,
  ARBITRUM_LIST,
  ...UNSUPPORTED_LIST_URLS,
];

export const DEFAULT_LIST_OF_LISTS: string[] = [...DEFAULT_ACTIVE_LIST_URLS, ...DEFAULT_INACTIVE_LIST_URLS];
