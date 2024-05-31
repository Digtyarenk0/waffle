import type { TokenList } from '@uniswap/token-lists';

import { contenthashToUri } from 'shared/utils/contenthashToUri';
import { parseENSAddress } from 'shared/utils/parseENSAddress';
import { uriToHttp } from 'shared/utils/uriToHttp';

const listCache: Map<string, TokenList> = new Map();

export const fetchTokenList = async (
  listUrl: string,
  resolveENSContentHash: (ensName: string) => Promise<string>,
): Promise<TokenList> => {
  const cached = listCache.get(listUrl);
  if (cached) {
    return cached;
  }

  let urls: string[];
  const parsedENS = parseENSAddress(listUrl);
  if (parsedENS) {
    let contentHashUri: string;
    try {
      contentHashUri = await resolveENSContentHash(parsedENS.ensName);
    } catch (error) {
      const message = `failed to resolve ENS name: ${parsedENS.ensName}`;
      console.debug(message, error);
      throw new Error(message);
    }
    let translatedUri: string;
    try {
      translatedUri = contenthashToUri(contentHashUri);
    } catch (error) {
      const message = `failed to translate contenthash to URI: ${contentHashUri}`;
      console.debug(message, error);
      throw new Error(message);
    }
    urls = uriToHttp(`${translatedUri}${parsedENS.ensPath ?? ''}`);
  } else {
    urls = uriToHttp(listUrl);
  }

  if (urls.length === 0) {
    throw new Error('Unrecognized list URL protocol.');
  }

  // Try each of the derived URLs until one succeeds.
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    let response: Response;
    try {
      response = await fetch(url, { credentials: 'omit' });
    } catch (error) {
      console.debug(`failed to fetch list: ${listUrl} (${url})`, error);
      continue;
    }

    if (!response.ok) {
      console.debug(`failed to fetch list ${listUrl} (${url})`, response.statusText);
      continue;
    }

    try {
      const json = await response.json();
      const list: TokenList = json;
      listCache.set(listUrl, list);
      return list;
    } catch (error) {
      console.debug(`failed to parse and validate list response: ${listUrl} (${url})`, error);
      continue;
    }
  }

  throw new Error(`No valid token list found at any URLs derived from ${listUrl}.`);
};
