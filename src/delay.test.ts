import test from 'tape'
import cast from './cast'
import collect from './collect'
import delay from './delay'

test('delay may sort things in time', async assert => {

  const subject = delay(
    cast(1, 3, 2, 7, 5, 6, 4, 8, 9),
    n => 150 / n
  )

  const actual = await collect(subject, 9)

  assert.deepEqual(actual, [9, 8, 7, 6, 5, 4, 3, 2, 1],
    'values sorted in descending order')

})