import type {Handler, Peer, Subscriptor, SyncHandler} from './types.ts'

export default function <I, O = I>(
  publish: Handler<I>,
  listen: Subscriptor<O>
): Peer<I, O> {
  const listeners: SyncHandler<O>[] = []
  listen(data => listeners.forEach(listener => listener(data)))
  return {publish, subscribe: listener => listeners.push(listener)}
}
