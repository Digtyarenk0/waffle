import { SupportedChainId } from 'entities/wallet/model/types/chain';

import { UniIpfsToken } from '../hooks/useGetTokens';

type token = { [key: string]: UniIpfsToken };

export const TESTNENT_TOKENS_LIST: { [chainId in SupportedChainId]: token } & {
  [chainId: number]: token;
} = {
  [SupportedChainId.POLYGON]: {},
  [SupportedChainId.ARBITRUM_SEPOLIA]: {
    weth: {
      name: 'Wrapped Ether',
      address: '0xeBDCbab722f9B4614b7ec1C261c9E52acF109CF8',
      symbol: 'WETH',
      decimals: 18,
      chainId: 421614,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    } as UniIpfsToken,
    wbtc: {
      name: 'Wrapped BTC',
      address: '0x7E4C556b4b0dCa7Cf3709E281c49f9aB07B79Ec3',
      symbol: 'WBTC',
      decimals: 8,
      chainId: 421614,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
    } as UniIpfsToken,
    // weth: '0xeBDCbab722f9B4614b7ec1C261c9E52acF109CF8',
    // wbtc: '0x7E4C556b4b0dCa7Cf3709E281c49f9aB07B79Ec3',
    // usdc: '0x2c04cB619d4c1d0863Fd138453F1c88c9c264d8a',
    // link: '0xcEDbe52BAc287add0dC66f6f8D8733B6F297deCf',
    // uni: '0x4064DCc3A9DE3E8b8DE6C080740F1Dea7B1aff63',
    // usdt: '0xEE17bAee6B4EFd6a8cD2db1999bEF7d550267b9D',
  },
};
