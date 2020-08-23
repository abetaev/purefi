import test from 'tape'
import cast from './cast'
import collect from './collect'
import mux from './mux'
import peer from './peer'

test('demux', async assert => {

  const muxed = mux(
    cast(1, 2, 3, 4, 5, 6, 7, 8, 9),
    n => n % 2 ? ['odds', n] : ['even', n]
  )

  const actual = await new Promise(resolve => {
    let even: number[]
    let odd: number[]
    muxed.subscribe(async ({ id, stream }) => {
      switch (id) {
        case 'odds':
          odd = await collect(stream, 5)
          break;
        case 'even':
          even = await collect(stream, 4)
          break;
      }
      odd && even && resolve([odd, even])
    })
  })

  assert.deepEqual(actual, [[1, 3, 5, 7, 9], [2, 4, 6, 8]])

})

test('run and upstream', async assert => {

  type Msg = { channel: string, data: number }

  const upstream = peer<Msg>()

  const muxed = mux<number, Msg>(
    upstream,
    msg => [`${msg.channel}`, msg.data],
    (data, channel) => ({ channel, data })
  )

  muxed.publish({ id: "odds", stream: cast(1, 3, 5, 7, 9) });
  muxed.publish({ id: "even", stream: cast(2, 4, 6, 8) })

  const actual = await collect(upstream, 9)

  assert.deepEqual(
    actual
      .sort(({ data: left }, { data: right }) => left - right),
    [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .map(data => ({
        channel: ((data % 2) ? "odds" : "even"),
        data
      }))
  )

})

test('names should be unique', async assert => {

  const upstream = cast(1, 2, 3, 4, 5, 6, 7, 8, 9)

  const muxed = mux<number, number>(
    upstream,
    n => [n % 2 ? "odds" : "even", n],
    n => n
  )

  await collect(muxed, 2)

  try {
    muxed.publish({ id: "odds", stream: peer() })
    assert.fail('should have thrown exception')
  } catch {
    assert.pass('exception on duplicate stream')
  }

})
