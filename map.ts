import type {Peer, Handler} from './types.ts'

export default function <I, O>(peer: Peer<I>, i2o: (input: I) => O, o2i: (output: O) => I): Peer<O> {
  return {
    publish: (value: O) => peer.publish(o2i(value)),
    subscribe: (subscriber: Handler<O>) => peer.subscribe((value) => subscriber(i2o(value)))
  }
}
