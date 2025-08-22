import Hashids from "hashids";

const hashids = new Hashids("mi-salt-secreta", 12);

export function encodeId(id: number) {
  return hashids.encode(id);
}

export function decodeId(hash: string) {
  const decoded = hashids.decode(hash);
  return decoded.length > 0 ? (decoded[0] as number) : null;
}
