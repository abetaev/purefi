import { Peer, Publisher } from "./types.ts";
import peer from "./peer.ts";

export type Converter<I,O> = (input: I) => O

/**
 * transforms values of streams with provider converter function(s).
 * 
 * type: duplex/simplex
 * 
 * @param stream source to transform
 * @param i2o transforms source values
 * @param o2i if provided will be used to transform values to upstream
 */
export default <I, O>(
  stream: Peer<I>,
  i2o: Converter<I,O>,
  o2i?: Converter<O,I>
): Peer<O> => {
  let upstream: Publisher<I>
  const output = peer<O>(consume => {
    upstream = stream.subscribe(event => consume(i2o(event)))
  });
  o2i && output.subscribe(event => upstream(o2i(event)))
  return output
}