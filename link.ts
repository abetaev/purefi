import gate from './gate.ts';
import peer from './peer.ts';
import { Peer } from './types.ts';

/**
 * creates link, a pair of peers which are publishing
 * and consuming only from each other.
 * 
 * @return pair of peers which are gated relatively to each other
 */
export default function <I, O = I>(): [Peer<I>, Peer<O>] {
  const node = peer<I | O>()

  const first = gate<I>(node as Peer<I>)
  const second = gate<O>(node as Peer<O>)

  return [first, second]
}