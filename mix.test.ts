import cast from "./cast.ts";
import collect from "./collect.ts";
import delay from "./delay.ts";
import mix from "./mix.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const test = Deno.test;

test("mixes two time streams", async () => {
  const subject = mix<[number]>(
    delay(cast(1, 2, 3, 4), (n) => 10 * n),
    delay(cast(1, 2, 3, 4), (n) => 10 * (4 - n)),
  );

  const actual = await collect(subject, 8);

  assertEquals(actual, [4, 1, 3, 2, 2, 3, 1, 4]);
});
