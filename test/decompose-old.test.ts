import { describe, it, expect, beforeEach, afterEach } from 'bun:test'

declare const global: any

/**
 * decompose-old.ts is a frozen historical reference (the pre-rewrite
 * implementation of decompose(), kept only for comparison -- see the
 * README's "Development status"). It is still a public subpath export
 * (`decompose.js/decompose-old`), so it gets its own coverage here rather
 * than being exercised only indirectly through decompose.ts's tests.
 */
describe('decompose-old.ts', () => {
  beforeEach(() => {
    global.decomposeGlobalUniqueID = 'off'
    global.decomposeAssignUniqueID = 'off'
  })

  afterEach(() => {
    global.decomposeGlobalUniqueID = 'off'
    global.decomposeAssignUniqueID = 'off'
    // Undo the cache-busting the regression test below does, so it can't
    // leave decompose-old.ts's module-level id-tracking store "poisoned"
    // (Set-based, from unset flags) for whichever test happens to require
    // it next -- see that test for why the module cache matters here.
    delete require.cache[require.resolve('../src/decompose-old')]
  })

  describe('isObject(objArg)', () => {
    it('is true for objects, arrays and functions', () => {
      const { isObject } = require('../src/decompose-old')

      expect(isObject({})).toBe(true)
      expect(isObject([])).toBe(true)
      expect(isObject(() => {})).toBe(true)
      expect(isObject(new Date())).toBe(true)
    })

    it('is false for primitives', () => {
      const { isObject } = require('../src/decompose-old')

      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject(1)).toBe(false)
      expect(isObject('a')).toBe(false)
      expect(isObject(true)).toBe(false)
      expect(isObject(Symbol('s'))).toBe(false)
    })
  })

  describe('isFunction(proposal)', () => {
    it('is true only for functions', () => {
      const { isFunction } = require('../src/decompose-old')

      expect(isFunction(() => {})).toBe(true)
      expect(isFunction(function named () {})).toBe(true)
      expect(isFunction(class {})).toBe(true)
      expect(isFunction({})).toBe(false)
      expect(isFunction(1)).toBe(false)
    })
  })

  describe('decompose(objArg)', () => {
    it('matches decompose.ts for the same nested-object input', () => {
      const { decompose: decomposeOld } = require('../src/decompose-old')
      const { decompose } = require('../src/decompose')

      const obj = { a: { b: 0 }, c: [{ d: 1 }, { e: true }] }

      expect(decomposeOld(obj)).toEqual(decompose(obj))
    })

    it('deduplicates circular references, same as decompose.ts', () => {
      const { decompose: decomposeOld } = require('../src/decompose-old')

      const a: any = {}
      a.self = a

      const result = decomposeOld(a)

      expect(result).toEqual([[[], a], [['self'], a]])
    })

    it('crashes on its own default id-tracking store: the exact bug decompose.ts fixes', () => {
      // Regression/documentation test: unlike decompose.ts (see its
      // "Development status" note in the README), decompose-old.ts's
      // default (flags left unset) branch lazily creates a `Set` for its
      // unique-id store, then calls the `Map`-only `.set()` on it the
      // moment `decomposeAssignUniqueID` isn't explicitly 'off'.
      //
      // decompose-old.ts computes that store once, in a module-level
      // `const`, the first time the module is required -- and bun's
      // require cache is shared across every test file in the run, not
      // just this one (verified separately), so an earlier test/file may
      // have already evaluated it under different flags. Busting
      // require.cache forces a fresh evaluation under the flags this test
      // actually sets, rather than depending on file/test execution order.
      delete global.decomposeGlobalUniqueID
      delete global.decomposeAssignUniqueID
      delete global.memUniqueIdFromEntity
      delete require.cache[require.resolve('../src/decompose-old')]

      const { decompose: decomposeOld } = require('../src/decompose-old')

      expect(() => decomposeOld({ a: { b: 1 } })).toThrow(/\.set is not a function/)
    })

    it('assigns unique ids per entry when the store is pre-seeded with a Map', () => {
      // Same 'on' flags as the crash test above, but pre-seeding
      // `global.memUniqueIdFromEntity` with a Map-based collection --
      // exactly what decompose.ts always does internally, and what
      // test/decompose.test.ts's logger tests do for `global`'s sake --
      // sidesteps the Set bug and exercises uniqueIdFromEntity's actual
      // id-assignment logic: a fresh id per distinct object/primitive, and
      // the same id again for an already-seen reference.
      global.decomposeGlobalUniqueID = 'on'
      global.decomposeAssignUniqueID = 'on'
      global.memUniqueIdFromEntity = { n: 0, collection: new Map(), collectionkey: new Map() }
      delete require.cache[require.resolve('../src/decompose-old')]

      const { decompose: decomposeOld } = require('../src/decompose-old')

      const shared = { b: 1 }
      const result = decomposeOld({ a: shared, c: shared, d: 2 })

      const [rootPath, rootValue, rootId] = result[0]
      const [, , aId] = result.find(([path]: [unknown[], unknown]) => path.length === 1 && path[0] === 'a')!
      const [, , cId] = result.find(([path]: [unknown[], unknown]) => path.length === 1 && path[0] === 'c')!
      const [, , dId] = result.find(([path]: [unknown[], unknown]) => path.length === 1 && path[0] === 'd')!

      expect(rootPath).toEqual([])
      expect(typeof rootId).toBe('number')
      // `a` and `c` point at the same object, so they share a unique id...
      expect(aId).toBe(cId)
      // ...while `d` (a primitive, the early-return branch of
      // uniqueIdFromEntity) gets its own, different one.
      expect(dId).not.toBe(aId)
    })
  })
})
