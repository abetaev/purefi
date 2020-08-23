import { Peer } from "./types";

import peer from "./peer";

type Predicate<T> = (input: T) => boolean

/**
 * packs series of events into arrays producing new stream
 * 
 * @param stream input stream to pack
 * @param begin predicate which is invoked on each event
 *              each time predicate returns `true` a new package is created
 *              no package will be created until `begin` returns `true`
 * @return packed stream
 */
export default <T>(stream: Peer<T>, begin: Predicate<T>): Peer<T[]> => peer(publish => {
  let pack: T[]
  stream.subscribe(event => {
    if (begin(event)) {
      if (pack) {
        publish(pack)
      }
      pack = []
    }
    if (pack) {
      pack.push(event)
    }
  })
})