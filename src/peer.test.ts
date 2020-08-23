import test from 'tape'
import next from './collect';
import peer from './peer';
import collect from './collect';
import cast from './cast';

test('emits all inputs', async assert => {

  const expected = [1, 2, 3]
  const subject = peer<number>((c) => expected.forEach(n => c(n)))

  const actual = await next(subject, 3)

  assert.deepEqual(actual, expected,
    'received all same as emitted')
})

test('emits all external inputs', async assert => {

  const expected = ['1', '2', '3']
  const subject = peer<string>()

  const promises = expected.map(s => subject.publish(s))

  const actual = next(subject, 3)

  await Promise.all(promises)

  assert.deepEqual(await actual, expected,
    'received everything emitted externally')

})

test('cross-publishing', async assert => {

  const stream = peer<number>()

  const promise1 = new Promise<number>(resolve => {
    const publishTo2 = stream.subscribe(value => resolve(value));
    setTimeout(() => publishTo2(2))
  })
  const promise2 = new Promise<number>(resolve => {
    const publishTo1 = stream.subscribe(value => resolve(value));
    setTimeout(() => publishTo1(1))
  })

  assert.equal(await promise2, 2)
  assert.equal(await promise1, 1)

})

test('no breach', async assert => {

  const stream = peer<string>()

  const publishingObj = new Promise(resolve => {
    const publish = stream.subscribe(message => assert.fail(`message breached: ${message}`))
    setTimeout(() => {
      publish('hello!')
      resolve('sent!')
    })
  })

  const receivingObj = new Promise(resolve => {
    stream.subscribe(message => resolve(message))
  })

  assert.equal(await publishingObj, 'sent!')
  assert.equal(await receivingObj, 'hello!')

})

test('unsubscribe', async assert => {

  const stream = cast(1, 2, 3, 4, 5, 6, 7, 9)

  const actual = collect(stream, 5)

  stream.subscribe(n => {
    if (n == 6) throw 'unsubscribe'
    if (n > 6) assert.fail("shouldn't happen")
  })

  assert.deepEqual(await actual, [1, 2, 3, 4, 5])

})

test("don't unsubscribe", async assert => {

  const stream = cast(1, 2, 3, 4, 5, 6, 7, 9)

  const actual = collect(stream, 7)

  await new Promise(resolve => stream.subscribe(n => {
    if (n == 6) throw "don't unsubscribe, please"
    if (n > 6) resolve()
  }));

  assert.deepEqual(await actual, [1, 2, 3, 4, 5, 6, 7]);
  
})