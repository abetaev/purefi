import purefi from './index.ts'
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

const test = Deno.test

const { keys } = Object
const fail = (message: string) => {throw message}

test('check exports', () => {
  const exports = keys(purefi);
  ['cast', 'peer'
    , 'pair', 'link'
    , 'mix', 'zip'
    , 'collect', 'delay'
    , 'filter', 'gate'
    , 'map', 'mux'
    , 'pack', 'unpack'].forEach(
      name => exports.includes(name) || fail(`${name} is not exported`)
    )
})