import gate from './gate.ts';
import peer from './peer.ts';
import { Peer } from './types.ts';

/**
 * creates link, a pair of peers which are publishing
 * and consuming only from each other.
 * 
 * @return pair of peers which are gated relatively to each other
 */
export default function <T>(): [Peer<T>, Peer<T>] {
  const node = peer<T>()

  const first = gate(node)
  const second = gate(node)

  return [first, second]
}