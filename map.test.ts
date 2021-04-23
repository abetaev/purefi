import cast from "./cast.ts";
import collect from "./collect.ts";
import map from "./map.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const test = Deno.test;

test("map number to string", async () => {
  const subject = map(cast<number>(1, 2, 3), (n) => `${n}`);

  const actual = await collect(subject, 3);

  assertEquals(
    actual,
    ["1", "2", "3"],
    "numbers are mapped to strings",
  );
});

test("upstream", async () => {
  const subject = cast<number>(1, 2, 3);

  const downstream = map(subject, (n) => `${n}`, (s) => +s);

  downstream.subscribe((input, peer) => peer.publish(input));

  const actual = await collect(subject, 6);

  assertEquals(
    actual,
    [1, 2, 3, 1, 2, 3],
  );
});
