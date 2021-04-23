import peer from "./peer.ts";
import { Peer } from "./types.ts";

type Filter<I, O extends I = I> = (
  value: I,
) => I extends O ? (O | undefined) : undefined;

/**
 * filters stream.
 * 
 * @param stream source to filter
 * @param filter decision maker
 * @param upstream upstream events from new stream
 */
export default <I, O extends I = I>(
  stream: Peer<I>,
  filter: Filter<I, O>,
  promoteUpstream = true,
): Peer<O> => {
  const output = peer<O>();
  const upstream = stream.subscribe((value) => {
    const filtered: O | undefined = filter(value);
    if (typeof filtered !== "undefined") output.publish(filtered);
  });
  promoteUpstream && output.subscribe(upstream);
  return output;
};
