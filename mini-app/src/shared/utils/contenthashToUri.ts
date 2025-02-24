import CID from 'cids';
import { getNameFromData, rmPrefix } from 'multicodec';
import { decode, toB58String } from 'multihashes';

export const hexToUint8Array = (hex: string): Uint8Array => {
  hex = hex.startsWith('0x') ? hex.substr(2) : hex;
  if (hex.length % 2 !== 0) throw new Error('hex must have length that is multiple of 2');
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return arr;
};

const UTF_8_DECODER = new TextDecoder('utf-8');

/**
 * Returns the URI representation of the content hash for supported codecs
 * @param contenthash to decode
 */

export const contenthashToUri = (contenthash: string): string => {
  const data = hexToUint8Array(contenthash);
  const codec = getNameFromData(data);
  switch (codec) {
    case 'ipfs-ns': {
      const unprefixedData = rmPrefix(data);
      const cid = new CID(unprefixedData);
      return `ipfs://${toB58String(cid.multihash)}`;
    }
    case 'ipns-ns': {
      const unprefixedData = rmPrefix(data);
      const cid = new CID(unprefixedData);
      const multihash = decode(cid.multihash);
      if (multihash.name === 'identity') {
        return `ipns://${UTF_8_DECODER.decode(multihash.digest).trim()}`;
      } else {
        return `ipns://${toB58String(cid.multihash)}`;
      }
    }
    default:
      throw new Error(`Unrecognized codec: ${codec}`);
  }
};
