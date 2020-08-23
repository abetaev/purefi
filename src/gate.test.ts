import test from 'tape'
import cast from './cast'
import collect from './collect'
import peer from './peer'
import gate from './gate'

test('downstream', async assert => {

  const source = cast(1, 2, 3)
  const target = gate(source);

  const actualSource = collect(source, 3)
  const actualTarget = collect(target, 3)

  assert.deepEqual(await actualTarget, [1, 2, 3])
  assert.deepEqual(await actualSource, await actualTarget)

})

test('upstream', async assert => {

  const target = peer()

  const source = gate(target);
  source.subscribe(event => assert.fail(`unexpected: ${event}`));
  const actual = collect(target, 3); // weird shit!
  [1, 2, 3].forEach(source.publish);

  assert.deepEqual(await actual, [1, 2, 3])

})