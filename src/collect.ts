import { Peer } from "./types";

/**
 * collects specified number of events from stream.
 * 
 * useful for testing.
 * 
 * @param stream from where events should be collected
 * @param n number of events to collect
 * @returns promise which resolves iif `n` events were collected
 */
export default <T>(stream: Peer<T>, n: number): Promise<T[]> => {
  const collected: T[] = []
  return new Promise(resolve => {
    stream.subscribe(value => {
      collected.length !== n && collected.push(value)
      if (collected.length === n) try {
        throw 'unsubscribe'
      } finally {
        resolve(collected)
      }
    })
  })
}