import pack from './pack.ts'
import cast from './cast.ts'
import collect from './collect.ts'
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";
const test = Deno.test

test('pack equal sequential values', async () => {
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

  assertEquals(actual, [[3, 3, 3], [2, 2], [1]],
    'packed properly')
})

test('truepack', async () => {

  const subject = pack(
    cast(false, true, true, false, true, false, true),
    v => v
  )

  const actual = await collect(subject, 3)

  assertEquals(actual, [[true], [true, false], [true, false]])

})