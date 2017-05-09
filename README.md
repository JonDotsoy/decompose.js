# decompose.js

[![Build Status](https://travis-ci.org/JonDotsoy/decompose.js.svg?branch=master)](https://travis-ci.org/JonDotsoy/decompose.js)
[![npm](https://img.shields.io/npm/v/decompose.js.svg)](https://www.npmjs.com/package/decompose.js)

Decompose a object.

> Why? In some cases it is necessary to inspect an object in depth and have the full value despite being able to modify it later. This project is well for inspecting an object to deepen and detarllar all its values.


## Inspiration
Read the next publicactión on [stackoverflow][stackoverflow-questions-8318357].
Would not it be great to know everything about an object? — This library allows it!!.

## Example

```javascript
const { decompose } = require('decompose.js')

const myObj = { a: { b: 0 }, c: [ { d: 1 }, { e: true } ] }

decompose( myObj ) // => Array
// [
//   [ []             , {"a":{"b":0},"c":[{"d":1},{"e":true}]} ],
//   [ ["a"]          , {"b":0}                                ],
//   [ ["a","b"]      , 0                                      ],
//   [ ["c"]          , [{"d":1},{"e":true}]                   ],
//   [ ["c","0"]      , {"d":1}                                ],
//   [ ["c","0","d"]  , 1                                      ],
//   [ ["c","1"]      , {"e":true}                             ],
//   [ ["c","1","e"]  , true                                   ],
//   [ ["c","length"] , 2                                      ]
// ]
```

### Que hacer con decompose.js
- Agregar soporte para manejo de objetos
    - Comparar objetos


[stackoverflow-questions-8318357]: http://stackoverflow.com/questions/8318357/javascript-pointer-reference-craziness-can-someone-explain-this "Javascript pointer/reference craziness. Can someone explain this?"

