import test from 'tape'
import cast from './cast'
import collect from './collect'
import map from './map'


test('map number to string', async assert => {

  const subject = map(cast<number>(1, 2, 3), n => `${n}`)

  const actual = await collect(subject, 3)

  assert.deepEqual(
    actual,
    ['1', '2', '3'],
    'numbers are mapped to strings'
  )

})

test('upstream', async assert => {

  const subject = cast<number>(1, 2, 3)

  const downstream = map(subject, n => `${n}`, s => +s);

  downstream.subscribe((input, peer) => peer.publish(input))

  const actual = await collect(subject, 6)

  assert.deepEqual(
    actual,
    [1, 2, 3, 1, 2, 3]
  )

})