import peer from './peer.ts';
import { Peer } from "./types.ts";

/**
 * zips input streams into single stream:
 * 
 * [type]: simplex
 * 
 * 3 stream example (underscore - empty time frame):
 *    1 2 _ 3 _ _ 4 \
 *    A _ B C D _ _  }  1 A α 2 B β 3 C γ 4 D δ
 *    _ α _ β _ γ δ /
 * 
 * resequences events from source streams in time
 * 
 * @param streams streams to be zipped (at least two make sense)
 * @return zipped stream
 */
export default <TS extends any[]>(...streams: Peer<TS[number]>[]): Peer<TS[number]> =>
  peer(publish => {
    const queues: (TS[number])[][] = streams.map(() => []);
    let currentQueue = 0;
    function emit() {
      if (queues[currentQueue].length) {
        publish(queues[currentQueue].shift())
        currentQueue++
        if (currentQueue === queues.length) currentQueue = 0
        emit()
      }
    }
    streams.forEach((stream, number) => stream.subscribe(value => {
      queues[number].push(value); emit()
    }))
  })