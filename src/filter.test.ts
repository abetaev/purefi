import test from 'tape'
import filter from './filter'
import cast from './cast'
import collect from './collect'
import peer from './peer'

test('filter out odds', async assert => {

  const subject = filter(
    cast(1, 2, 3, 4, 5, 6, 7, 8),
    (n: number) => n % 2 === 0 ? n : undefined,
    false
  )

  const actual = await collect(subject, 4)

  assert.deepEqual(actual, [2, 4, 6, 8])

})

test('discrimination', async assert => {

  type MsgA = { type: 'A' }
  type MsgB = { type: 'B' }
  type Msg = MsgA | MsgB

  const subject = filter<Msg, MsgA>(
    cast<Msg>({ type: 'A' }, { type: 'B' }, { type: 'A' }),
    msg => msg.type === 'A' ? msg : undefined,
    false
  )

  const actual = await collect(subject, 2)

  assert.deepEqual(actual, [{ type: 'A' }, { type: 'A' }])

})

test('upstream', async assert => {

  const subject = peer<string | number>()

  const numbers = filter(subject, x => typeof x === "number" ? x : undefined);
  const strings = filter(subject, x => typeof x === "string" ? x : undefined);

  [1, 3, 5, 7, 9].forEach(numbers.publish);
  ['2', '4', '6', '8'].forEach(strings.publish)

  const actual = await collect(subject, 9)

  assert.deepEqual(
    actual.sort((l, r) => (+l) - (+r)),
    [1, '2', 3, '4', 5, '6', 7, '8', 9]
  )

})