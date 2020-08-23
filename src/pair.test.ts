import test from 'tape'
import pair from './pair'
import collect from './collect'

test("isolation", { skip: true }, async assert => {


  const [left, right] = pair();

  let direction = "none";
  left.subscribe(value => direction === "l2r" && assert.fail(`unexpected in 'l': ${value}`));
  right.subscribe(value => direction === "r2l" && assert.fail(`unexpected in 'r': ${value}`));

  direction = "l2r";
  [1, 2, 3].forEach(left.publish)
  assert.deepEqual(await collect(right, 3), [1, 2, 3])

  direction = "r2l";
  [6, 5, 4].forEach(right.publish)
  assert.deepEqual(await collect(left, 3), [6, 5, 4])

})

test('exchange', async assert => {

  const [subject1, subject2] = pair();

  const actual1 = collect(subject1, 4);
  const actual2 = collect(subject2, 5);

  [1, 3, 5, 7, 9].forEach(subject1.publish);
  [2, 4, 6, 8].forEach(subject2.publish);


  assert.deepEqual(await actual1, [2, 4, 6, 8])
  assert.deepEqual(await actual2, [1, 3, 5, 7, 9])

})