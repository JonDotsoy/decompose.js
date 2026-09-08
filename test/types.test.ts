import { describe, it, expectTypeOf } from 'bun:test'

import decompose, { type DecomposeOptions } from '../src/decompose'
import Composition, { type LoaderCallback } from '../src/Composition'
import { expect as decomposeExpect, eql } from '../src/expect'
import type { DecomposedEntry as ExpectDecomposedEntry, PathSegment as ExpectPathSegment } from '../src/expect'
import { logger, loggerMD } from '../src/logger'
import type { DecomposedEntry as LoggerDecomposedEntry } from '../src/logger'
import { decompose as decomposeOld, isObject, isFunction } from '../src/decompose-old'
import type { DecomposedEntry as OldDecomposedEntry, PathSegment as OldPathSegment } from '../src/decompose-old'

/**
 * These are compile-time-only type tests: the actual checking happens when
 * TypeScript type-checks this file, via `bun run typecheck` (which `bun test`
 * / `bun run test` runs first). Every case below uses `it.skip` on purpose —
 * bun's `expectTypeOf().parameter(n)` returns `undefined` at runtime (its
 * value only exists for TypeScript to narrow at compile time), so actually
 * *executing* these bodies would throw. `it.skip` still type-checks the body
 * (tsc doesn't care whether a test runs) while keeping `bun test` green; the
 * cases show up as skipped in its output rather than as false failures.
 */

describe('Type tests', () => {
  describe('decompose.ts', () => {
    it.skip('decompose() is a function of (unknown, DecomposeOptions?) => Composition | void', () => {
      expectTypeOf(decompose).toBeFunction()
      expectTypeOf(decompose).parameter(0).toBeUnknown()
      expectTypeOf(decompose).parameter(1).toEqualTypeOf<DecomposeOptions | undefined>()
      expectTypeOf(decompose).returns.toEqualTypeOf<Composition | void>()
    })

    it.skip('DecomposeOptions has an optional isOk: boolean', () => {
      expectTypeOf<DecomposeOptions>().toHaveProperty('isOk')
      expectTypeOf<DecomposeOptions['isOk']>().toEqualTypeOf<boolean | undefined>()
    })
  })

  describe('Composition.ts', () => {
    it.skip('Composition is a constructible class', () => {
      expectTypeOf(Composition).toBeConstructibleWith()
      expectTypeOf(Composition).instance.toBeObject()
    })

    it.skip('Composition#tree accepts a LoaderCallback', () => {
      expectTypeOf(Composition.prototype.tree).parameter(0).toEqualTypeOf<LoaderCallback>()
    })

    it.skip('Composition#diffOf accepts (other, reporter?, stopFirst?)', () => {
      expectTypeOf(Composition.prototype.diffOf).parameter(0).toBeAny()
      expectTypeOf(Composition.prototype.diffOf).parameter(1).toEqualTypeOf<LoaderCallback | null | undefined>()
      expectTypeOf(Composition.prototype.diffOf).parameter(2).toEqualTypeOf<boolean | undefined>()
    })

    it.skip('LoaderCallback has the (value, name, path, comp, root) => void shape', () => {
      expectTypeOf<LoaderCallback>().parameter(0).toBeAny()
      expectTypeOf<LoaderCallback>().parameter(1).toEqualTypeOf<string | symbol | null>()
      expectTypeOf<LoaderCallback>().parameter(2).toEqualTypeOf<(string | symbol)[]>()
      expectTypeOf<LoaderCallback>().parameter(3).toEqualTypeOf<Composition>()
      expectTypeOf<LoaderCallback>().parameter(4).toEqualTypeOf<Composition>()
      expectTypeOf<LoaderCallback>().returns.toBeVoid()
    })
  })

  describe('expect.ts', () => {
    it.skip('expect() takes any value and returns a chainable semantic assertion object', () => {
      expectTypeOf(decomposeExpect).toBeFunction()
      expectTypeOf(decomposeExpect).parameter(0).toBeAny()

      const result = decomposeExpect({})
      expectTypeOf(result).toHaveProperty('eq')
      expectTypeOf(result).toHaveProperty('eql')
      expectTypeOf(result).toHaveProperty('not')
      expectTypeOf(result.eq).toBeFunction()
      expectTypeOf(result.to.eq).toBeFunction()
      expectTypeOf(result.not.eq).toBeFunction()
    })

    it.skip('eql() compares two decomposed lists and returns a boolean', () => {
      expectTypeOf(eql).parameter(0).toEqualTypeOf<ExpectDecomposedEntry[]>()
      expectTypeOf(eql).parameter(1).toEqualTypeOf<ExpectDecomposedEntry[]>()
      expectTypeOf(eql).returns.toBeBoolean()
    })

    it.skip('DecomposedEntry is a [PathSegment[], any] tuple', () => {
      expectTypeOf<ExpectPathSegment>().toEqualTypeOf<string | symbol>()
      expectTypeOf<ExpectDecomposedEntry>().toEqualTypeOf<[ExpectPathSegment[], any]>()
    })
  })

  describe('logger.ts', () => {
    it.skip('logger() takes a decomposed list and an optional format, returns a string', () => {
      expectTypeOf(logger).parameter(0).toEqualTypeOf<LoggerDecomposedEntry[]>()
      expectTypeOf(logger).parameter(1).toEqualTypeOf<string | undefined>()
      expectTypeOf(logger).returns.toBeString()
    })

    it.skip('loggerMD() has the same shape as logger()', () => {
      expectTypeOf(loggerMD).parameter(0).toEqualTypeOf<LoggerDecomposedEntry[]>()
      expectTypeOf(loggerMD).returns.toBeString()
    })
  })

  describe('decompose-old.ts', () => {
    it.skip('decompose() (legacy) returns a DecomposedEntry[]', () => {
      expectTypeOf(decomposeOld).parameter(0).toBeAny()
      expectTypeOf(decomposeOld).returns.toEqualTypeOf<OldDecomposedEntry[]>()
    })

    it.skip('isObject()/isFunction() are (any) => boolean predicates', () => {
      expectTypeOf(isObject).toEqualTypeOf<(objArg: any) => boolean>()
      expectTypeOf(isFunction).toEqualTypeOf<(proposal: any) => boolean>()
    })

    it.skip('DecomposedEntry is a [PathSegment[], any, number?] tuple', () => {
      expectTypeOf<OldPathSegment>().toEqualTypeOf<string | symbol>()
      expectTypeOf<OldDecomposedEntry>().toEqualTypeOf<[OldPathSegment[], any, number?]>()
    })
  })
})
