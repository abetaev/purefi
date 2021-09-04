import type {Peer, Handler} from "./types.ts";

type Input<T> = {[channel in keyof T]: Peer<T[channel]>}
type Output<T> = {[K in keyof T]-?: {channel: K, value: T[K]}}[keyof T]
type OutputPeer<T extends {[channel in keyof T]: T[channel]}> = Peer<Output<T>>

export default function <T>(
  source: Input<T>
): OutputPeer<T> {
  const subscribers: Handler<Output<T>>[] = []
  const mixedPeer: OutputPeer<T> = {
    publish: ({channel, value}) => source[channel].publish(value),
    subscribe: (subscriber) => subscribers.push(subscriber)
  };

  Object.keys(source)
    .map(key => key as keyof Input<T>) /* <-- for sake of typing!!! */
    .forEach(channel => source[channel].subscribe(value => subscribers.forEach(subscriber => subscriber({channel, value}))));

  return mixedPeer
}
