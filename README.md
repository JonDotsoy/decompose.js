# decompose.js [![Build Status](https://travis-ci.org/JonDotsoy/decompose.js.svg?branch=master)](https://travis-ci.org/JonDotsoy/decompose.js)

## Inspiration
read the next publicactión on [stackoverflow](stackoverflow/questions/8318357).
Would not it be great to know everything about an object? — This library allows it !!.

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



[stackoverflow/questions/8318357]: http://stackoverflow.com/questions/8318357/javascript-pointer-reference-craziness-can-someone-explain-this "Javascript pointer/reference craziness. Can someone explain this?"


