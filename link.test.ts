import link from "./link.ts";
import collect from "./collect.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const test = Deno.test;
const fail = (message: string) => {
  throw message;
};

test("link isolation", async () => {
  const [left, right] = link();

  let direction = "none";
  left.subscribe((value) =>
    direction === "l2r" && fail(`unexpected in 'l': ${value}`)
  );
  right.subscribe((value) =>
    direction === "r2l" && fail(`unexpected in 'r': ${value}`)
  );

  direction = "l2r";
  [1, 2, 3].forEach(left.publish);
  assertEquals(await collect(right, 3), [1, 2, 3]);

  direction = "r2l";
  [6, 5, 4].forEach(right.publish);
  assertEquals(await collect(left, 3), [6, 5, 4]);
});

test("exchange", async () => {
  const [subject1, subject2] = link();

  const actual1 = collect(subject1, 4);
  const actual2 = collect(subject2, 5);

  [1, 3, 5, 7, 9].forEach(subject1.publish);
  [2, 4, 6, 8].forEach(subject2.publish);

  assertEquals(await actual1, [2, 4, 6, 8]);
  assertEquals(await actual2, [1, 3, 5, 7, 9]);
});
