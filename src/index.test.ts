import purefi from './index'
import test from 'tape'

const { keys } = Object

test('check exports', assert => {
  const exports = keys(purefi);
  ['cast', 'peer'
    , 'pair', 'link'
    , 'mix', 'zip'
    , 'collect', 'delay'
    , 'filter', 'gate'
    , 'map', 'mux'
    , 'pack', 'unpack'].forEach(
      name => exports.includes(name) || assert.fail(`${name} is not exported`)
    )
  assert.end()
})