import peer from './peer.ts'
import { Peer } from "./types.ts"

/**
 * mixes input streams into single stream:
 * 
 * [type]: simplex
 * 
 * 3 stream example (underscore - empty time frame):
 *    1 2 _ 3 _ _ 4 \
 *    A _ B C D _ _  }  1 A 2 α B 3 C β D γ 4 δ
 *    _ α _ β _ γ δ /
 *
 * opposed to zip puts event into resulting stream as soon as
 * it arrives into any of source streams.
 * 
 * @param streams sources to be mixed (at least two will make sense)
 * @return mixed stream
 */
export default <T extends unknown[]>(...streams: Peer<T[number]>[]): Peer<T[number]> =>
  peer(publish => streams.forEach(stream => stream.subscribe(publish)))