import { Peer, Subscriber } from "./types.ts";

export type Converter<I, O> = (input: I) => O;

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
  downstream: Peer<I>,
  i2o: Converter<I, O>,
  o2i: Converter<O, I>
): Peer<O> => {
  const peer:Peer<O> = {
    publish: (event: O) => downstream.publish(o2i(event)),
    subscribe: (subscriber: Subscriber<O>) => {
      const publish = downstream.subscribe(event => subscriber(i2o(event), peer))
      return (event) => publish(o2i(event))
    }
  }
  return peer;
};
