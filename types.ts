/**
 * publishes events onto bus
 * 
 * @param value value to publish into topic
 * @returns promise to be resolved when value is actually published
 */
type Publisher<T> = ((value: T) => Promise<void>) | ((value: T) => void);

/**
 * receives events after being put into bus
 * 
 * @param input event received because of subscription
 * @param publish function to send events to other subscribers through topic
 *                published event will not be delivered to this subsciber
 */
type Subscriber<T, S extends Peer<T> = Peer<T>> = (input: T, source: S) => void;

interface Peer<T> {
  /**
   * subscribes to events in peer
   * 
   * @param subscriber notified on each input event
   * @returns publisher to put events into topic externally
   *          events published with this publisher will not
   *          be delivered to the subscriber from @param
   */
  subscribe: (subscriber: Subscriber<T>) => Publisher<T>;

  /**
   * publishes event to all current subscribers.
   */
  publish: Publisher<T>;
}

export type { Peer, Publisher, Subscriber };
