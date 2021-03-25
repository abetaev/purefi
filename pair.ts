import peer from "./peer.ts"
import { Peer } from "./types.ts"

/**
 * should work as `link` but it does not.
 * 
 * @param source if provided will be used as first gated peer
 * @return a pair of mutually gated peers.
 */
export default <T>(source?: Peer<T>): [Peer<T>, Peer<T>] => {
  source = source || peer()
  const target = peer<T>()

  return [
    {
      publish: target.subscribe(source.publish),
      subscribe: source.subscribe
    },
    {
      publish: source.subscribe(target.publish),
      subscribe: target.subscribe
    }
  ]
}