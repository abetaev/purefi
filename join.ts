import peer from "./peer.ts";
import {Peer, Publisher} from "./types.ts";

type Input<T> = {[channel in keyof T]: Peer<T[channel]>}
type Output<T extends {[channel in keyof T]: T[channel]}> = Peer<{[K in keyof T]-?: {channel: K, value: T[K]}}[keyof T]>


export default function <T>(
  source: Input<T>
): Output<T> {
  const mixedPeer: Output<T> = peer();

  const publishers = {} as {[channel in keyof T]: Publisher<T[channel]>}

  Object.keys(source)
    .map(key => key as keyof Input<T>) /* <-- for sake of typing!!! */
    .forEach(channel => publishers[channel] = source[channel].subscribe((value) => publish({channel, value})));

  const publish = mixedPeer.subscribe(<K extends keyof T>({channel, value}: {channel: K, value: T[K]}) => publishers[channel](value))

  return mixedPeer
}
