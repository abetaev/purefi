import test from 'tape'
import cast from './cast'
import unpack from './unpack'
import next from './collect'

test('flattens the stream', async assert => {
  const subject = unpack(cast([1, 2, 3, 4], [5, 6, 7], [8, 9]))

  const actual = await next(subject, 9)

  assert.deepEqual(
    actual, [1, 2, 3, 4, 5, 6, 7, 8, 9],
    'stream unpacked'
  )
})