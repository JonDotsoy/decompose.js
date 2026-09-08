/**
 * @module decompose
 * @example
 * import decompose from 'decompose.js'
 * const { decompose } = require('decompose.js')
 */

declare const global: any

export type PathSegment = string | symbol
export type DecomposedEntry = [PathSegment[], any, number?]

// By default (no `global.decomposeAssignUniqueID` set) unique ids are never
// computed, so this storage is never touched — see `decompose()` below.
const memUniqueIdFromEntity: any = global.decomposeGlobalUniqueID === 'on'
  ? global.memUniqueIdFromEntity ? global.memUniqueIdFromEntity : (global.memUniqueIdFromEntity = { n: 0, collection: new Map(), collectionkey: new Map() })
  : ({ n: 0, collection: new Map(), collectionkey: new Map() })

const uniqueIdFromEntity = (obj: any): number => {
  if (!isObject(obj)) {
    memUniqueIdFromEntity.n += 1
    return memUniqueIdFromEntity.n
  }

  if (!memUniqueIdFromEntity.collection.has(obj)) {
    memUniqueIdFromEntity.n += 1
    memUniqueIdFromEntity.collection.set(obj, memUniqueIdFromEntity.n)
    memUniqueIdFromEntity.collectionkey.set(memUniqueIdFromEntity.n, obj)
  }

  return memUniqueIdFromEntity.collection.get(obj)
}

/**
 * Determina si un valor es un objeto (incluye arrays, funciones, etc.), a
 * diferencia de un primitivo.
 */
export function isObject (objArg: any): boolean { return Object(objArg) === objArg }

function getKeys (objArg: any): PathSegment[] {
  return isObject(objArg) ? ([] as PathSegment[]).concat(Object.getOwnPropertySymbols(objArg), Object.getOwnPropertyNames(objArg)) : []
}

/**
 * Este función lee un elemento y lo descompone recursivamente en una lista
 * plana de entradas `[path, value]` — una por cada propiedad (propia, incluyendo
 * símbolos) alcanzable desde `value`, más una entrada raíz con `path: []`.
 *
 * Cada valor que sea un objeto o array conserva su referencia original: mutar
 * un valor decompuesto se refleja en cualquier otra entrada que apunte al
 * mismo objeto. Las referencias circulares se recorren una sola vez.
 *
 * @param objArg - Valor para descomponer.
 * @param fn     - Sin uso por ahora; reservado para un futuro callback de recorrido.
 * @param prefix - Uso interno: el `path` acumulado durante la recursión.
 * @param history - Uso interno: objetos ya visitados, para evitar ciclos infinitos.
 * @return La lista de entradas `[path, value]` (o `[path, value, uniqueId]`, ver
 *         `global.decomposeAssignUniqueID`).
 * @example
 * decompose({ a: { b: 0 }, c: [ { d: 1 }, { e: true } ] })
 * // [
 * //   [ []             , {"a":{"b":0},"c":[{"d":1},{"e":true}]} ],
 * //   [ ["a"]          , {"b":0}                                ],
 * //   [ ["a","b"]      , 0                                      ],
 * //   [ ["c"]          , [{"d":1},{"e":true}]                   ],
 * //   [ ["c","0"]      , {"d":1}                                ],
 * //   [ ["c","0","d"]  , 1                                      ],
 * //   [ ["c","1"]      , {"e":true}                             ],
 * //   [ ["c","1","e"]  , true                                   ],
 * //   [ ["c","length"] , 2                                      ]
 * // ]
 */
export function decompose (objArg: any, fn?: Function, prefix: PathSegment[] = [], history: Set<any> = new Set()): DecomposedEntry[] {
  let collection: DecomposedEntry[] = []

  if (prefix.length === 0) {
    const toPush: DecomposedEntry = [[], objArg]

    if (global.decomposeAssignUniqueID === 'on') {
      toPush.push(uniqueIdFromEntity(objArg))
    }

    collection.push(toPush)

    if (!history.has(objArg)) {
      if (isObject(objArg)) history.add(objArg)
    }
  }

  getKeys(objArg).forEach((index) => {
    const content = objArg[index]
    const _i = ([] as PathSegment[]).concat(prefix, index)

    const toPush: DecomposedEntry = [_i, content]

    if (global.decomposeAssignUniqueID === 'on') {
      toPush.push(uniqueIdFromEntity(content))
    }

    collection.push(toPush)

    if (!history.has(content)) {
      if (isObject(content)) history.add(content)

      if (isObject(content)) {
        const _o = decompose(content, fn, _i, history)

        collection = collection.concat(_o)
      }
    }
  })

  return collection
}

export default decompose
