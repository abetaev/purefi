import test from 'tape'
import cast from './cast';
import collect from './collect';
import delay from './delay';
import mix from './mix';

test('mixes two time streams', async assert => {
  const subject = mix<[number]>(
    delay(cast(1, 2, 3, 4), n => 10 * n),
    delay(cast(1, 2, 3, 4), n => 10 * (4 - n))
  )

  const actual = await collect(subject, 8)

  assert.deepEqual(actual, [4, 1, 3, 2, 2, 3, 1, 4])
})