import cast from './cast.ts'
import collect from './collect.ts'
import peer from './peer.ts'
import gate from './gate.ts'
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const test = Deno.test
const fail = (message: string) => {throw message}

test('downstream', async () => {

  const source = cast(1, 2, 3)
  const target = gate(source);

  const actualSource = collect(source, 3)
  const actualTarget = collect(target, 3)

  assertEquals(await actualTarget, [1, 2, 3])
  assertEquals(await actualSource, await actualTarget)

})

test('upstream', async () => {

  const target = peer()

  const source = gate(target);
  source.subscribe(event => fail(`unexpected: ${event}`));
  const actual = collect(target, 3); // weird shit!
  [1, 2, 3].forEach(source.publish);

  assertEquals(await actual, [1, 2, 3])

})