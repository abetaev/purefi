import next from './collect.ts'
import cast from './cast.ts'
import zip from './zip.ts'
import { Peer } from "./types.ts";
import collect from './collect.ts';
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";
const test = Deno.test

test('zips two emitters', async () => {

  const subject: Peer<string | number> = zip(
    cast<number>(1, 3, 5),
    cast<string>('2', '4', '6')
  )

  const actual = collect(subject, 6)

  assertEquals(await actual, [1, '2', 3, '4', 5, '6'])
})

test('zip three emitters', async () => {
  const subject = zip<[number]>(
    cast(1, 4, 7),
    cast(2, 5, 8),
    cast(3, 6, 9)
  )

  const actual = await next(subject, 9)

  assertEquals(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9])
})

test('zip four emitters', async () => {
  const subject = zip<[number]>(
    cast(1, 5),
    cast(2, 6),
    cast(3, 7),
    cast(4, 8)
  )

  const actual = await next(subject, 8)

  assertEquals(actual, [1, 2, 3, 4, 5, 6, 7, 8])
})