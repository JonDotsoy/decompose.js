const expect = require('expect.js')
const padEnd = require('lodash/padEnd')
const get = require('lodash/get')
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

    // Circular
    b.b=b
    a.b=b

    // Symbol
    a[c] = d

    d.i=i
    a.h=h
    d.f=f
    f.e=e

    const deMyObj = decompose( a )

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

    const deMyObj = decompose( myObj )

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
        [ []             , {"a":{"b":0},"c":[{"d":1},{"e":true}]} ],
        [ ["a"]          , {"b":0}                                ],
        [ ["a","b"]      , 0                                      ],
        [ ["c"]          , [{"d":1},{"e":true}]                   ],
        [ ["c","0"]      , {"d":1}                                ],
        [ ["c","0","d"]  , 1                                      ],
        [ ["c","1"]      , {"e":true}                             ],
        [ ["c","1","e"]  , true                                   ],
        [ ["c","length"] , 2                                      ]
      ]
    )

  })
})
