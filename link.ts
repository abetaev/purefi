import gate from "./gate.ts";
import peer from "./peer.ts";
import { Peer, Publisher, Subscriber } from "./types.ts";

/**
 * dual exchange point of information, allows to build chained structures
 * (network connection)
 *
 * useful of handling interfaces like WebSocket = { send, onmessage, ... }
 * to port to purefi interface.
 *
 * @param publishDownstream function to publish to downstream service
 * @param subscribeDownstream function to subscribe to downstream service
 * @returns peer which represents duplex connection
 */
export default function <T>(
  publishDownstream: Publisher<T>,
  subscribeDownstream: (subscriber: Subscriber<T>) => void,
): Peer<T> {
  const { subscribe, publish } = peer<T>();
  subscribeDownstream(subscribe((data) => publishDownstream(data)));
  return gate({
    subscribe,
    publish,
  });
}
