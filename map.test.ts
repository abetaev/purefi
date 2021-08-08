import cast from "./cast.ts";
import collect from "./collect.ts";
import map from "./map.ts";
import peer from "./peer.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const test = Deno.test;

test("output", async () => {
  const subject = map(cast<number>(1, 2, 3), (n) => `${n}`, (s) => +s);

  const actual = await collect(subject, 3);

  assertEquals(
    actual,
    ["1", "2", "3"],
    "numbers are mapped to strings",
  );

  
});

test("input", async () => {
  const subject = peer<number>();

  const downstream = map(subject, (n) => `${n}`, (s) => +s);

  ['1', '2', '3'].forEach(downstream.publish)

  const actual = await collect(subject, 3);

  assertEquals(
    actual,
    [1, 2, 3],
  );
});

// TODO: test publish/subscribe isolation
