import {Peer} from './types.ts'


/**
 * circuits two peers so that they start to exchange data.
 */
export default function<T>(l: Peer<T>, r: Peer<T>) {
  l.subscribe(r.publish)
  r.subscribe(l.publish)
}