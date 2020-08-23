import { Peer } from "./types";
import peer from "./peer";

/**
 * creates *gated* peer which will publish only into source
 * peer and consume only from source peer:
 * subscribers will only receive message from `source`
 * 
 * @param source peer to be gated
 * @return gated peer
 */
export default <T>(source: Peer<T>): Peer<T> => {
  const target = peer<T>()
  return {
    subscribe: target.subscribe,
    publish: source.subscribe(target.publish)
  }
}