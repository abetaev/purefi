import { Publisher, Peer, Subscriber } from './types.ts';

type Producer<T> = (publisher: Publisher<T>) => void

const later = (fun: () => void) => Promise.resolve(fun).then(fun => fun())

/**
 * basic function to define peer.
 *
 * @param producer if provided, supplies consumer with values when they arrive
 */
export default <T>(producer?: Producer<T>): Peer<T> => {

  let subscribers: Subscriber<T>[] = []

  const publishToAllExcept = (exception: Subscriber<T>) => (message: T) =>
    publishTo(subscribers.filter(subscriber => subscriber !== exception))(message)

  const subscribe = (subscriber: Subscriber<T>) => {
    subscribers.push(subscriber)
    return publishToAllExcept(subscriber)
  }

  // TODO: cache2reuse
  const publishTo = (targets: Subscriber<T>[]) => (message: T) =>
    later(() => {
      targets.filter(target => subscribers.includes(target)).forEach(target => {
        try {
          target(message, {
            subscribe,
            publish: publishToAllExcept(target)
          })
        } catch (e) {
          if (typeof e === "string" && e === "unsubscribe") {
            subscribers = subscribers.filter(subscriber => subscriber !== target)
          }
        }
      })
    })

  const publish = publishTo(subscribers)

  producer && later(() => producer(input => publish(input)))

  return {
    subscribe,
    publish
  }

}