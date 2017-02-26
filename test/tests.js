const expect = require('expect.js')
const padEnd = require('lodash/padEnd')
const get = require('lodash/get')
const last = require('lodash/last')

// Configure global options to decompose
global.decomposeGlobalUniqueID = 'off'
global.decomposeAssignUniqueID = 'off'

describe('Module Decompose.js', function () {
  describe('/decompose.js', function () {
    describe('decompose(obj) => decomposition', function () {
      it('Simple use', () => {
        const { decompose } = require('../src/decompose')

        const myObj = {
          a: {
            b: 3,
            c: 'string'
          }
        }

        expect(decompose(myObj)).to.eql([
          [ [], { a: { b: 3, c: 'string' } } ],
          [ ['a'], { b: 3, c: 'string' } ],
          [ ['a', 'b'], 3 ],
          [ ['a', 'c'], 'string' ]
        ])
      })

      it('compare pointer/reference', function () {
        const { decompose } = require('../src/decompose')

        // declare
        let a = {}
        let b = {}
        let c = Symbol('c')
        let d = {}
        let e = Symbol('e')
        let f = {}
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

        expect(deMyObj[0][1]).to.be(a)
        expect(deMyObj[1][0][0]).to.be(c)
        expect(deMyObj[1][1]).to.be(d)
        expect(deMyObj[2][1]).to.be(i)
        expect(deMyObj[3][1]).to.be(f)
        expect(deMyObj[4][1]).to.be(e)
        expect(deMyObj[5][1]).to.be(b)
      })

      it('demo 1', () => {
        const { decompose } = require('../src/decompose')

        const myObj = { a: { b: 0 }, c: [ { d: 1 }, { e: true } ] }

        const deMyObj = decompose(myObj)

        // // LOGGER
        // const lastDeMyObj = last(deMyObj)

        // console.log('[')
        // deMyObj.forEach((e) => {
        //   const [path, value] = e
        //   process.stdout.write('  ')
        //   process.stdout.write('[ ')
        //   process.stdout.write( padEnd( JSON.stringify( path ), 15 ) )
        //   process.stdout.write(', ')
        //   process.stdout.write( padEnd( JSON.stringify( value ), 38 ) )
        //   if (e===lastDeMyObj) {
        //     process.stdout.write(' ]')
        //   } else {
        //     process.stdout.write(' ],')
        //   }
        //   process.stdout.write('\n')
        // })
        // console.log(']')

        expect(deMyObj).to.be.eql(
          [
            [ [], {'a': {'b': 0}, 'c': [{'d': 1}, {'e': true}]} ],
            [ ['a'], {'b': 0} ],
            [ ['a', 'b'], 0 ],
            [ ['c'], [{'d': 1}, {'e': true}] ],
            [ ['c', '0'], {'d': 1} ],
            [ ['c', '0', 'd'], 1 ],
            [ ['c', '1'], {'e': true} ],
            [ ['c', '1', 'e'], true ],
            [ ['c', 'length'], 2 ]
          ]
        )
      })

      it('Example with muted object', () => {
        const { decompose } = require('../src/decompose')

        const fnToMutableObj = (obj) => Object.assign(obj, {a: Object.assign({}, {b: obj.a.b})})

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

        expect(dePrevObj).to.be.eql(deNextObj)
        expect(prevObj).to.be.eql(nextObj)
        expect(dePrevObj[0][1]).to.be(deNextObj[0][1])
        expect(dePrevObj[1][1]).not.to.be(deNextObj[1][1])
        expect(dePrevObj[2][1]).to.be(deNextObj[2][1])
        expect(dePrevObj[3][1]).to.be(deNextObj[3][1])
      })
    })
  })

  describe('/expect.js', function () {
    describe('eql(obj, other) => Boolean', function () {
      it('Comporation #1', () => {
        const { decompose } = require('../src/decompose')
        const { eql } = require('../src/expect')

        const a = Symbol('a')
        const obj = {[a]: {b: 3}}

        const dePrevObj = decompose(obj)

        obj[a] = {b: obj[a].b}

        const deNextObj = decompose(obj)

        expect(dePrevObj).to.eql(deNextObj)
        expect(dePrevObj[0][1]).to.be(deNextObj[0][1])
        expect(dePrevObj[1][1]).not.to.be(deNextObj[1][1])
        expect(dePrevObj[2][1]).to.be(deNextObj[2][1])

        // With decompose/eql
        expect(eql(dePrevObj, deNextObj)).to.be(false)
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

          const a = {}
          const b = {}
          const c = {}

          expect(() => { decomposeExpect(b).eq(c) }).to.throwException()
          expect(() => { decomposeExpect(b).eql(c) }).to.throwException()
          expect(() => { decomposeExpect(c).eq(c) }).not.to.throwException()
          expect(() => { decomposeExpect(c).eql(c) }).not.to.throwException()

          /* With .to.eq */
          expect(() => { decomposeExpect(b).to.eq(c) }).to.throwException()
          expect(() => { decomposeExpect(b).to.eql(c) }).to.throwException()
          expect(() => { decomposeExpect(c).to.eq(c) }).not.to.throwException()
          expect(() => { decomposeExpect(c).to.eql(c) }).not.to.throwException()
        })
      })

      describe('.not.to.eq(compare)', function () {
        it('#1', () => {
          const { expect: decomposeExpect } = require('../src/expect')

          const a = {}
          const b = {}
          const c = {}

          expect(() => { decomposeExpect(b).not.eq(c) }).not.to.throwException()
          expect(() => { decomposeExpect(b).not.eql(c) }).not.to.throwException()
          expect(() => { decomposeExpect(c).not.eq(c) }).to.throwException()
          expect(() => { decomposeExpect(c).not.eql(c) }).to.throwException()

          /* With .to.eq */
          expect(() => { decomposeExpect(b).not.to.eq(c) }).not.to.throwException()
          expect(() => { decomposeExpect(b).not.to.eql(c) }).not.to.throwException()
          expect(() => { decomposeExpect(c).not.to.eq(c) }).to.throwException()
          expect(() => { decomposeExpect(c).not.to.eql(c) }).to.throwException()
        })
      })

      describe('Show ERROR', function () {
        it('', () => {
          const { expect } = require('../src/expect')


          expect({}).to.eq({})

        })
      })

    })
  })

  describe('/logger.js', function () {
    describe('logger(decomposedObj, format)', function () {
      beforeEach(() => {
        global.memUniqueIdFromEntity = ({n: 0, collection: new Map(), collectionkey: new Map()})
        global.decomposeGlobalUniqueID = 'on'
        global.decomposeAssignUniqueID = 'on'
      })

      after(() => {
        global.memUniqueIdFromEntity = void (0)
        global.decomposeGlobalUniqueID = 'off'
        global.decomposeAssignUniqueID = 'off'
      })

      it('markdown format #1', () => {
        const {decompose} = require('../src/decompose.js')
        const {logger} = require('../src/logger.js')

        class OObj {}

        const c = ['true', new OObj()]

        /*!*/
        c.push(c)

        const valNull = null
        const valRegExp = /./
        const valNaN = NaN
        const valFn = (() => {})//.bind(global)
        const valSymbol = Symbol('s')

        const obj = {
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
        // obj.u = Object
        obj[Symbol('b')] = 'OObj'

        console.log( logger( decompose( obj ) ) )
      })
    })
  })
})

