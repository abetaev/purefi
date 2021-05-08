import peer from "./peer.ts";
import { Peer } from "./types.ts";

type Demuxed<T> = { id: string; peer: Peer<T> };
type DemuxedPeer<T> = Peer<Demuxed<T>>;

/**
 * creates multiplexing/demultiplexing peer gate.
 *
 * [type]: duplex/simplex
 * 
 * @param stream to which peer gate should be attached (upstream)
 * @param i2o function which provides demultiplexing hash/id to
 *            distinct between demultiplexed (downstream) channels
 *            it also allows to convert input value if needed
 * @param o2i function to convert demultiplexed value and hash/id
 *            into multiplexed value (to send to upstream)
 */
export default <T, I, O = I>(
  muxed: Peer<I | O>,
  i2o: (input: I) => [string, T],
  o2i?: (value: T, id: string) => O,
): DemuxedPeer<T> => {
  const demux = peer<Demuxed<T>>();

  const peers: { [id: string]: Peer<T> } = {};

  const addDemuxed = ({ id, peer }: Demuxed<T>) => {
    if (peers[id]) {
      throw new Error(`peer ${id} already muxed`);
    }
    peers[id] = peer;
    o2i && peer.subscribe((output) => publishUpstream(o2i(output, id)));
    return demux.publish({ id, peer });
  };

  const publishUpstream = muxed.subscribe((input) => {
    const [id, value] = i2o(input as I);
    if (!peers[id]) {
      addDemuxed({ id, peer: peer<T>() });
    }
    peers[id].publish(value);
  });

  return {
    subscribe: demux.subscribe,
    publish: addDemuxed,
  };
};
