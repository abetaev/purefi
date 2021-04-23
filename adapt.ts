import { Peer, Publisher, Subscriber } from "./types.ts";
import peer from "./peer.ts";

/**
 * convenience for adapting existing interfaces to purefi.
 *
 * @param publishDownstream 
 * @param subscribeDownstream
 * @returns 
 */
export default function <T>(
  publishDownstream: Publisher<T>,
  subscribeDownstream: (subscriber: Subscriber<T>) => void,
): Peer<T> {
  const { subscribe, publish } = peer<T>();
  subscribeDownstream(subscribe((data) => publishDownstream(data)));
  return {
    subscribe,
    publish,
  };
}
