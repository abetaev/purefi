import { Peer } from "./types";
import peer from "./peer";

/**
 * unpacks lists of element into continuous stream
 * 
 * aka "flat map", but such name is irreversible therefore irrelevant
 * 
 * @param stream stream of packed values to unpack
 * @returns stream of unpacked values
 */
export default <T>(stream: Peer<T[]>): Peer<T> =>
  peer(publish => stream.subscribe(packed => packed.forEach(publish)))