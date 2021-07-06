import peer from "./peer.ts";
import gate from "./gate.ts";
import { Peer } from "./types.ts";

/**
 * creates linked pair of peers which are publishing
 * and consuming only from each other.
 * 
 * @return pair of peers which are gated relatively to each other
 */
/**
 * creates link, a pair of peers which are publishing
 * and consuming only from each other.
 * 
 * @return pair of peers which are gated relatively to each other
 */
export default function <T>(): [Peer<T>, Peer<T>] {
  const node = peer<T>();

  const first = gate<T>(node as Peer<T>);
  const second = gate<T>(node as Peer<T>);

  return [first, second]
}