import { Peer } from "./types.ts";
import peer from "./peer.ts";

/**
 * create peer and publish given values.
 * 
 * @param values to publish
 * @returns newly created peer which will receive provided values
 */
export default <T>(...values: T[]): Peer<T> =>
  peer<T>((p) => values.forEach((v) => p(v)));
