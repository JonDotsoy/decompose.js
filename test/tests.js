const expect = require('expect.js')
const padEnd = require('lodash/padEnd')
const last = require('lodash/last')

describe('decompose', function () {
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
    let h = "string"
    let i = true


    console.log( {c,e} )


  })

  it('demo 1', () => {
    const { decompose } = require('../src/decompose')

    const myObj = { a: { b: 0 }, c: [ { d: 1 }, { e: true } ] }

    const deMyObj = decompose( myObj )

    const lastDeMyObj = last(deMyObj)
    
    console.log('[')
    deMyObj.forEach((e) => {
      const [path, value] = e
      process.stdout.write('  ')
      process.stdout.write('[ ')
      process.stdout.write( padEnd( JSON.stringify( path ), 15 ) )
      process.stdout.write(', ')
      process.stdout.write( padEnd( JSON.stringify( value ), 38 ) )
      if (e===lastDeMyObj) {
        process.stdout.write(' ]')
      } else {
        process.stdout.write(' ],')
      }
      process.stdout.write('\n')
    })
    console.log(']')

  })
})
