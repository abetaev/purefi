import test from 'tape'
import pack from './pack'
import cast from './cast'
import collect from './collect'

test('pack equal sequential values', async assert => {
  let previous: number
  const subject = pack(
    cast(3, 3, 3, 2, 2, 1, 0),
    (current: number) => {
      const result = current !== previous
      previous = current
      return result
    }
  )

  const actual = await collect(subject, 3)

  assert.deepEqual(actual, [[3, 3, 3], [2, 2], [1]],
    'packed properly')
})

test('truepack', async assert => {

  const subject = pack(
    cast(false, true, true, false, true, false, true),
    v => v
  )

  const actual = await collect(subject, 3)

  assert.deepEqual(actual, [[true], [true, false], [true, false]])

})