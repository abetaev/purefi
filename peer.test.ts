import peer from "./peer.ts";
import collect from "./collect.ts";
import cast from "./cast.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const test = Deno.test;
const fail = (message: string) => {
  throw message;
};

test("emits all inputs", async () => {
  const expected = [1, 2, 3];
  const subject = peer<number>((c) => expected.forEach((n) => c(n)));

  const actual = await collect(subject, 3);

  assertEquals(actual, expected, "received all same as emitted");
});

test("emits all external inputs", async () => {
  const expected = ["1", "2", "3"];
  const subject = peer<string>();

  const promises = expected.map((s) => subject.publish(s));

  const actual = collect(subject, 3);

  await Promise.all(promises);

  assertEquals(
    await actual,
    expected,
    "received everything emitted externally",
  );
});

test("cross-publishing", async () => {
  const stream = peer<number>();

  const promise1 = new Promise<number>((resolve) => {
    const publishTo2 = stream.subscribe((value) => resolve(value));
    setTimeout(() => publishTo2(2));
  });
  const promise2 = new Promise<number>((resolve) => {
    const publishTo1 = stream.subscribe((value) => resolve(value));
    setTimeout(() => publishTo1(1));
  });

  assertEquals(await promise2, 2);
  assertEquals(await promise1, 1);
});

test("no breach", async () => {
  const stream = peer<string>();

  const publishingObj = new Promise((resolve) => {
    const publish = stream.subscribe((message) =>
      fail(`message breached: ${message}`)
    );
    setTimeout(() => {
      publish("hello!");
      resolve("sent!");
    });
  });

  const receivingObj = new Promise((resolve) => {
    stream.subscribe((message) => resolve(message));
  });

  assertEquals(await publishingObj, "sent!");
  assertEquals(await receivingObj, "hello!");
});

test("unsubscribe", async () => {
  const stream = cast(1, 2, 3, 4, 5, 6, 7, 9);

  const actual = collect(stream, 5);

  stream.subscribe((n) => {
    if (n == 6) throw "unsubscribe";
    if (n > 6) fail("shouldn't happen");
  });

  assertEquals(await actual, [1, 2, 3, 4, 5]);
});

test("don't unsubscribe", async () => {
  const stream = cast(1, 2, 3, 4, 5, 6, 7, 9);

  const actual = collect(stream, 7);

  await new Promise<void>((resolve) =>
    stream.subscribe((n) => {
      if (n == 6) throw "don't unsubscribe, please";
      if (n > 6) resolve();
    })
  );

  assertEquals(await actual, [1, 2, 3, 4, 5, 6, 7]);
});
