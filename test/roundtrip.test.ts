import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import map from 'setimmutable/map'

declare const global: any

/**
 * setimmutable/map(seed, pairs) builds a new object from an array of
 * `[path, value]` pairs -- the exact shape decompose() produces, just
 * applied in the opposite direction. Feeding decompose()'s own output back
 * into map() and comparing the result against the original input is an
 * end-to-end round-trip: it exercises decompose()'s full traversal (nested
 * objects, arrays, array-index paths) through an independent, real
 * consumer library instead of only against hand-written expected arrays.
 */
function decomposeToObject (value: object) {
  const { decompose } = require('../src/decompose')

  const pairs = decompose(value)
    .filter(([path]: [unknown[], unknown]) => path.length > 0)
    // decompose() reports an array's `.length` as its own entry (see
    // test/decompose.test.ts's "demo 1"); map() doesn't need it fed back in
    // to reconstruct the array, so skip it to avoid a redundant/racy
    // assignment order against the real elements.
    .filter(([path]: [(string | symbol)[], unknown]) => path[path.length - 1] !== 'length')
    .map(([path, value]: [(string | symbol)[], unknown]) => [path, value])

  return map({}, pairs)
}

describe('decompose() + setimmutable/map round-trip', () => {
  beforeAll(() => {
    global.decomposeGlobalUniqueID = 'off'
    global.decomposeAssignUniqueID = 'off'
  })

  afterAll(() => {
    global.decomposeGlobalUniqueID = 'off'
    global.decomposeAssignUniqueID = 'off'
  })

  it('rebuilds a nested object with plain string keys', () => {
    const original = { a: { b: 0 }, c: { d: 1, e: { f: 2 } } }

    expect(decomposeToObject(original)).toEqual(original)
  })

  it('rebuilds arrays, including nested ones, back into real Arrays', () => {
    const original = { list: [1, 2, { nested: [3, 4] }], empty: [] }

    const rebuilt = decomposeToObject(original)

    expect(rebuilt).toEqual(original)
    expect(Array.isArray((rebuilt as any).list)).toBe(true)
    expect(Array.isArray((rebuilt as any).list[2].nested)).toBe(true)
  })

  it('rebuilds objects with symbol keys and symbol-keyed paths', () => {
    const s = Symbol('s')
    const original: any = { [s]: { value: 1 }, plain: 2 }

    expect(decomposeToObject(original)).toEqual(original)
  })

  it('agrees with decompose-old.ts on the same fixture', () => {
    const { decompose: decomposeOld } = require('../src/decompose-old')

    const original = { a: [1, { b: 2 }], c: 3 }

    const pairs = decomposeOld(original)
      .filter(([path]: [unknown[], unknown]) => path.length > 0)
      .filter(([path]: [(string | symbol)[], unknown]) => path[path.length - 1] !== 'length')
      .map(([path, value]: [(string | symbol)[], unknown]) => [path, value])

    expect(map({}, pairs)).toEqual(original)
  })
})
