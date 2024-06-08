/**
 * Given a URI that may be ipfs, ipns, http, https, ar, or data protocol, return the fetch-able http(s) URLs for the same content
 * @param uri to convert to fetch-able http url
 */

export const uriToHttp = (uri: string): string[] => {
  const protocol: string = uri.split(':')[0].toLowerCase();
  switch (protocol) {
    case 'data':
      return [uri];
    case 'https':
      return [uri];
    case 'http':
      return ['https' + uri.substr(4), uri];
    case 'ipfs': {
      const hash: string | undefined = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
      return hash ? [`https://ipfs.io/ipfs/${hash}/`, `https://ipfs.io/ipfs/${hash}/`] : [];
    }
    case 'ipns': {
      const name: string | undefined = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
      return name ? [`https://ipfs.io/ipfs/${name}/`, `https://ipfs.io/ipfs/${name}/`] : [];
    }
    case 'ar': {
      const tx: string | undefined = uri.match(/^ar:(\/\/)?(.*)$/i)?.[2];
      return tx ? [`https://ipfs.io/ipfs/${tx}/`, `https://ipfs.io/ipfs/${tx}/`] : [];
    }
    default:
      return [];
  }
};
