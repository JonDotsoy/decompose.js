declare const global: any

type PathSegment = string | symbol
type DecomposedEntry = [PathSegment[], any, number?]

const memUniqueIdFromEntity: any = global.decomposeGlobalUniqueID !== 'off'
  ? global.memUniqueIdFromEntity ? global.memUniqueIdFromEntity : (global.memUniqueIdFromEntity = { n: 0, collection: new Set() })
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

export function isObject (objArg: any): boolean { return Object(objArg) === objArg }

export function isFunction (proposal: any): boolean { return typeof (proposal) === 'function' }

function getKeys (objArg: any): PathSegment[] {
  return isObject(objArg) ? ([] as PathSegment[]).concat(Object.getOwnPropertySymbols(objArg), Object.getOwnPropertyNames(objArg)) : []
}

export function decompose (objArg: any, fn?: Function, prefix: PathSegment[] = [], history: Set<any> = new Set()): DecomposedEntry[] {
  let collection: DecomposedEntry[] = []

  if (prefix.length === 0) {
    const toPush: DecomposedEntry = [[], objArg]

    if (global.decomposeAssignUniqueID !== 'off') {
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

    if (global.decomposeAssignUniqueID !== 'off') {
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
