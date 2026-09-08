# Function: decompose()

> **decompose**(`objArg`, `fn?`, `prefix?`, `history?`): [`DecomposedEntry`](../type-aliases/DecomposedEntry.md)[]

Defined in: [decompose.ts:73](https://github.com/JonDotsoy/decompose.js/blob/master/src/decompose.ts#L73)

Este función lee un elemento y lo descompone recursivamente en una lista
plana de entradas `[path, value]` — una por cada propiedad (propia, incluyendo
símbolos) alcanzable desde `value`, más una entrada raíz con `path: []`.

Cada valor que sea un objeto o array conserva su referencia original: mutar
un valor decompuesto se refleja en cualquier otra entrada que apunte al
mismo objeto. Las referencias circulares se recorren una sola vez.

## Parameters

### objArg

`any`

Valor para descomponer.

### fn?

`Function`

Sin uso por ahora; reservado para un futuro callback de recorrido.

### prefix?

[`PathSegment`](../type-aliases/PathSegment.md)[] = `[]`

Uso interno: el `path` acumulado durante la recursión.

### history?

`Set`\<`any`\> = `...`

Uso interno: objetos ya visitados, para evitar ciclos infinitos.

## Returns

[`DecomposedEntry`](../type-aliases/DecomposedEntry.md)[]

La lista de entradas `[path, value]` (o `[path, value, uniqueId]`, ver
        `global.decomposeAssignUniqueID`).

## Example

```ts
decompose({ a: { b: 0 }, c: [ { d: 1 }, { e: true } ] })
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
