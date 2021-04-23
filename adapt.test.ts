import adapt from "./adapt.ts";
import { Subscriber } from "./types.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const test = Deno.test;

test("should adapt inputs to peer interface", async () => {
  const actualPublished: number[] = [];
  const publish = (number: number) => {
    actualPublished.push(number);
  };

  const subscribers: Subscriber<number>[] = [];
  const subscribe = (subscriber: Subscriber<number>) => {
    subscribers.push(subscriber);
  };

  const subject = adapt<number>(
    publish,
    subscribe,
  );

  const actualReceived: number[] = [];
  const publishDownstream = subject.subscribe((number) => actualReceived.push(number));

  const expectedPublished = [1234, 567, 89, 0];
  await Promise.all(expectedPublished.map((number) => publishDownstream(number)));

  const expectedReceived = [1, 23, 456, 7890];
  const publishUpstream = (number: number) =>
    Promise.all(subscribers.map((publish) => publish(number, subject)));
  await Promise.all(expectedReceived.map((number) => publishUpstream(number)));

  assertEquals(
    actualPublished,
    expectedPublished,
    "published wrong numbers",
  );

  assertEquals(
    actualReceived,
    expectedReceived,
    "received wrong numbers",
  );
});
