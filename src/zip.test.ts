import test from 'tape'
import next from './collect'
import cast from './cast'
import zip from './zip'
import { Peer } from "./types";
import collect from './collect';

test('zips two emitters', async assert => {

  const subject: Peer<string | number> = zip(
    cast<number>(1, 3, 5),
    cast<string>('2', '4', '6')
  )

  const actual = collect(subject, 6)

  assert.deepEqual(await actual, [1, '2', 3, '4', 5, '6'])
})

test('zip three emitters', async assert => {
  const subject = zip<[number]>(
    cast(1, 4, 7),
    cast(2, 5, 8),
    cast(3, 6, 9)
  )

  const actual = await next(subject, 9)

  assert.deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9])
})

test('zip four emitters', async assert => {
  const subject = zip<[number]>(
    cast(1, 5),
    cast(2, 6),
    cast(3, 7),
    cast(4, 8)
  )

  const actual = await next(subject, 8)

  assert.deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8])
})