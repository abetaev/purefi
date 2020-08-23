import { Converter } from './map';
import peer from './peer';
import { Peer } from './types';

/**
 * creates stream of delayed events.
 * 
 * @param stream source of original events
 * @param delay function which decides delay for each event
 */
export default <T>(stream: Peer<T>, delay: Converter<T, number>): Peer<T> =>
  peer(publish => stream.subscribe(event => setTimeout(() => publish(event), delay(event))))