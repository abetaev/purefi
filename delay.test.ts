import cast from "./cast.ts";
import collect from "./collect.ts";
import delay from "./delay.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const test = Deno.test;

test("delay may sort things in time", async () => {
  const subject = delay(
    cast(1, 3, 2, 7, 5, 6, 4, 8, 9),
    (n) => 150 / n,
  );

  const actual = await collect(subject, 9);

  assertEquals(
    actual,
    [9, 8, 7, 6, 5, 4, 3, 2, 1],
    "values sorted in descending order",
  );
});
