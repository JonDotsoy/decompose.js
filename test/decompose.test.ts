import { describe, it, expect, beforeEach, afterEach } from 'bun:test'

declare const global: any

// Configure global options to decompose
global.decomposeGlobalUniqueID = 'off'
global.decomposeAssignUniqueID = 'off'

describe('Module Decompose.js', function () {
  describe('/decompose.ts', function () {
    describe('decompose(obj) => decomposition', function () {
      it('Simple use', () => {
        const { decompose } = require('../src/decompose')

        const myObj = {
          a: {
            b: 3,
            c: 'string'
          }
        }

        expect(decompose(myObj)).toEqual([
          [[], { a: { b: 3, c: 'string' } }],
          [['a'], { b: 3, c: 'string' }],
          [['a', 'b'], 3],
          [['a', 'c'], 'string']
        ] as any)
      })

      it('compare pointer/reference', function () {
        const { decompose } = require('../src/decompose')

        // declare
        let a: any = {}
        let b: any = {}
        let c = Symbol('c')
        let d: any = {}
        let e = Symbol('e')
        let f: any = {}
        let g = 1
        let h = 'string'
        let i = true

        // Circular
        b.b = b
        a.b = b

        // Symbol
        a[c] = d

        d.i = i
        a.h = h
        d.f = f
        f.e = e

        const deMyObj = decompose(a)

        expect(deMyObj[0][1]).toBe(a)
        expect(deMyObj[1][0][0]).toBe(c)
        expect(deMyObj[1][1]).toBe(d)
        expect(deMyObj[2][1]).toBe(i)
        expect(deMyObj[3][1]).toBe(f)
        expect(deMyObj[4][1]).toBe(e)
        expect(deMyObj[5][1]).toBe(b)
      })

      it('demo 1', () => {
        const { decompose } = require('../src/decompose')

        const myObj = { a: { b: 0 }, c: [{ d: 1 }, { e: true }] }

        const deMyObj = decompose(myObj)

        expect(deMyObj).toEqual(
          [
            [[], { 'a': { 'b': 0 }, 'c': [{ 'd': 1 }, { 'e': true }] }],
            [['a'], { 'b': 0 }],
            [['a', 'b'], 0],
            [['c'], [{ 'd': 1 }, { 'e': true }]],
            [['c', '0'], { 'd': 1 }],
            [['c', '0', 'd'], 1],
            [['c', '1'], { 'e': true }],
            [['c', '1', 'e'], true],
            [['c', 'length'], 2]
          ] as any
        )
      })

      it('Example with muted object', () => {
        const { decompose } = require('../src/decompose')

        const fnToMutableObj = (obj: any) => Object.assign(obj, { a: Object.assign({}, { b: obj.a.b }) })

        const prevObj = {
          a: {
            b: {
              c: 1
            }
          }
        }

        const dePrevObj = decompose(prevObj)

        const nextObj = fnToMutableObj(prevObj)

        const deNextObj = decompose(nextObj)

        expect(dePrevObj).toEqual(deNextObj)
        expect(prevObj).toEqual(nextObj)
        expect(dePrevObj[0][1]).toBe(deNextObj[0][1])
        expect(dePrevObj[1][1]).not.toBe(deNextObj[1][1])
        expect(dePrevObj[2][1]).toBe(deNextObj[2][1])
        expect(dePrevObj[3][1]).toBe(deNextObj[3][1])
      })
    })
  })

  describe('/expect.ts', function () {
    describe('eql(obj, other) => Boolean', function () {
      it('Comporation #1', () => {
        const { decompose } = require('../src/decompose')
        const { eql } = require('../src/expect')

        const a = Symbol('a')
        const obj: any = { [a]: { b: 3 } }

        const dePrevObj = decompose(obj)

        obj[a] = { b: obj[a].b }

        const deNextObj = decompose(obj)

        expect(dePrevObj).toEqual(deNextObj)
        expect(dePrevObj[0][1]).toBe(deNextObj[0][1])
        expect(dePrevObj[1][1]).not.toBe(deNextObj[1][1])
        expect(dePrevObj[2][1]).toBe(deNextObj[2][1])

        // With decompose/eql
        expect(eql(dePrevObj, deNextObj)).toBe(false)
      })
    })

    describe('expect(value)', function () {
      describe('semantic', function () {
        it('expect().eq()', () => {
          let a = {}
          require('../src/expect').expect(a).eq(a)
        })

        it('expect().eql()', () => {
          let a = {}
          require('../src/expect').expect(a).eql(a)
        })

        it('expect().toEql()', () => {
          let a = {}
          require('../src/expect').expect(a).toEql(a)
        })

        it('expect().toEq()', () => {
          let a = {}
          require('../src/expect').expect(a).toEq(a)
        })

        it('expect().to.eq()', () => {
          let a = {}
          require('../src/expect').expect(a).to.eq(a)
        })

        it('expect().to.eql()', () => {
          let a = {}
          require('../src/expect').expect(a).to.eql(a)
        })

        it('expect().not.to.eq()', () => {
          let a = {}
          let b = {}
          require('../src/expect').expect(a).not.to.eq(b)
        })

        it('expect().not.to.eql()', () => {
          let a = {}
          let b = {}
          require('../src/expect').expect(a).not.to.eql(b)
        })

        it('expect().not.toEql()', () => {
          let a = {}
          let b = {}
          require('../src/expect').expect(a).not.toEql(b)
        })

        it('expect().not.toEq()', () => {
          let a = {}
          let b = {}
          require('../src/expect').expect(a).not.toEq(b)
        })

        it('expect().notEq()', () => {
          let a = {}
          let b = {}
          require('../src/expect').expect(a).notEq(b)
        })

        it('expect().notEql()', () => {
          let a = {}
          let b = {}
          require('../src/expect').expect(a).notEql(b)
        })

        it('expect().notToEql()', () => {
          let a = {}
          let b = {}
          require('../src/expect').expect(a).notToEql(b)
        })

        it('expect().notToEq()', () => {
          let a = {}
          let b = {}
          require('../src/expect').expect(a).notToEq(b)
        })
      })

      describe('.to.eq(compare)', function () {
        it('#1', () => {
          const { expect: decomposeExpect } = require('../src/expect')

          const b = {}
          const c = {}

          expect(() => { decomposeExpect(b).eq(c) }).toThrow()
          expect(() => { decomposeExpect(b).eql(c) }).toThrow()
          expect(() => { decomposeExpect(c).eq(c) }).not.toThrow()
          expect(() => { decomposeExpect(c).eql(c) }).not.toThrow()

          /* With .to.eq */
          expect(() => { decomposeExpect(b).to.eq(c) }).toThrow()
          expect(() => { decomposeExpect(b).to.eql(c) }).toThrow()
          expect(() => { decomposeExpect(c).to.eq(c) }).not.toThrow()
          expect(() => { decomposeExpect(c).to.eql(c) }).not.toThrow()
        })
      })

      describe('.not.to.eq(compare)', function () {
        it('#1', () => {
          const { expect: decomposeExpect } = require('../src/expect')

          const b = {}
          const c = {}

          expect(() => { decomposeExpect(b).not.eq(c) }).not.toThrow()
          expect(() => { decomposeExpect(b).not.eql(c) }).not.toThrow()
          expect(() => { decomposeExpect(c).not.eq(c) }).toThrow()
          expect(() => { decomposeExpect(c).not.eql(c) }).toThrow()

          /* With .to.eq */
          expect(() => { decomposeExpect(b).not.to.eq(c) }).not.toThrow()
          expect(() => { decomposeExpect(b).not.to.eql(c) }).not.toThrow()
          expect(() => { decomposeExpect(c).not.to.eq(c) }).toThrow()
          expect(() => { decomposeExpect(c).not.to.eql(c) }).toThrow()
        })
      })

      describe('Show ERROR', function () {
        it.skip('', () => {
          const { expect: decomposeExpect } = require('../src/expect')

          decomposeExpect({}).to.eq({})
        })
      })
    })
  })

  describe('/logger.ts', function () {
    describe('logger(decomposedObj, format)', function () {
      beforeEach(() => {
        global.memUniqueIdFromEntity = ({ n: 0, collection: new Map(), collectionkey: new Map() })
        global.decomposeGlobalUniqueID = 'on'
        global.decomposeAssignUniqueID = 'on'
      })

      afterEach(() => {
        global.memUniqueIdFromEntity = void (0)
        global.decomposeGlobalUniqueID = 'off'
        global.decomposeAssignUniqueID = 'off'
      })

      it('markdown format #1', () => {
        const { decompose } = require('../src/decompose')
        const { logger } = require('../src/logger')

        class OObj {}

        const c: any[] = ['true', new OObj()]

        /*!*/
        c.push(c)

        const valNull = null
        const valRegExp = /./
        const valNaN = NaN
        const valFn = (() => {})
        const valSymbol = Symbol('s')

        const obj: any = {
          valRegExp,
          valNull,
          valNaN,
          valFn,
          valSymbol,
          c,
          [Symbol('a')]: {
            n: /./,
            m: OObj
          }
        }

        obj.i = obj
        obj[Symbol('b')] = 'OObj'

        console.log(logger(decompose(obj)))
      })
    })
  })
})
