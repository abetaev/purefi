import cast from "./cast.ts";
import collect from "./collect.ts";
import {assertEquals} from "https://deno.land/std@0.90.0/testing/asserts.ts";

const test = Deno.test;

test("should collect inputs", async () => {
  const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const peer = cast<number>(...expected)
  const actual = await collect(peer, 10)

  assertEquals(actual, expected)
});
