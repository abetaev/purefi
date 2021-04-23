import peer from "./peer.ts";
import { Peer } from "./types.ts";

type Demuxed<T> = { id: string; stream: Peer<T> };
type DemuxedPeer<T> = Peer<Demuxed<T>>;

/**
 * creates multiplexing/demultiplexing stream gate.
 *
 * [type]: duplex/simplex
 * 
 * @param stream to which stream gate should be attached (upstream)
 * @param i2o function which provides demultiplexing hash/id to
 *            distinct between demultiplexed (downstream) channels
 *            it also allows to convert input value if needed
 * @param o2i function to convert demultiplexed value and hash/id
 *            into multiplexed value (to send to upstream)
 */
export default <T, I, O = I>(
  stream: Peer<I | O>,
  i2o: (input: I) => [string, T],
  o2i?: (value: T, id: string) => O,
): DemuxedPeer<T> => {
  const demux = peer<Demuxed<T>>();

  const peers: { [id: string]: Peer<T> } = {};

  const addDemuxed = ({ id, stream }: Demuxed<T>) => {
    if (peers[id]) {
      throw new Error(`stream ${id} already muxed`);
    }
    peers[id] = stream;
    o2i && stream.subscribe((output) => publishUpstream(o2i(output, id)));
    return demux.publish({ id, stream });
  };

  const publishUpstream = stream.subscribe((input) => {
    const [id, value] = i2o(input as I);
    if (!peers[id]) {
      addDemuxed({ id, stream: peer<T>() });
    }
    peers[id].publish(value);
  });

  return {
    subscribe: demux.subscribe,
    publish: addDemuxed,
  };
};
