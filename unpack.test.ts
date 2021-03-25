import cast from './cast.ts'
import unpack from './unpack.ts'
import next from './collect.ts'
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const test = Deno.test

test('flattens the stream', async () => {
  const subject = unpack(cast([1, 2, 3, 4], [5, 6, 7], [8, 9]))

  const actual = await next(subject, 9)

  assertEquals(
    actual, [1, 2, 3, 4, 5, 6, 7, 8, 9],
    'stream unpacked'
  )
})