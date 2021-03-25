import { Converter } from './map.ts';
import peer from './peer.ts';
import { Peer } from './types.ts';

/**
 * creates stream of delayed events.
 * 
 * @param stream source of original events
 * @param delay function which decides delay for each event
 */
export default <T>(stream: Peer<T>, delay: Converter<T, number>): Peer<T> =>
  peer(publish => stream.subscribe(event => setTimeout(() => publish(event), delay(event))))