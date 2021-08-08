import cast from "./cast.ts";
import collect from "./collect.ts";
import delay from "./delay.ts";
import join from "./join.ts";
import peer from "./peer.ts";
import {assertEquals} from "https://deno.land/std@0.90.0/testing/asserts.ts";

const test = Deno.test;

test("output", async () => {
  const subject = join<{
    first: number,
    second: number
  }>({
    first: delay(cast(1, 2, 3, 4), (n: number) => 10 * n),
    second: delay(cast(1, 2, 3, 4), (n: number) => 10 * (4 - n)),
  });

  const actual = await collect(subject, 8);

  assertEquals(actual, [
    {channel: "second", value: 4},
    {channel: "first", value: 1},
    {channel: "second", value: 3},
    {channel: "first", value: 2},
    {channel: "second", value: 2},
    {channel: "first", value: 3},
    {channel: "second", value: 1},
    {channel: "first", value: 4}
  ])

});

test("input", async () => {
  const first = peer<number>()
  const second = peer<number>()
  const subject = join<{
    first: number,
    second: number
  }>({first, second});

  const firstPromise = collect(first, 4)
  const secondPromise = collect(second, 4)

  subject.publish({channel: "second", value: 4})
  subject.publish({channel: "first", value: 1})
  subject.publish({channel: "second", value: 3})
  subject.publish({channel: "first", value: 2})
  subject.publish({channel: "second", value: 2})
  subject.publish({channel: "first", value: 3})
  subject.publish({channel: "second", value: 1})
  subject.publish({channel: "first", value: 4})

  assertEquals(await firstPromise, [1, 2, 3, 4])
  assertEquals(await secondPromise, [4, 3, 2, 1])

})