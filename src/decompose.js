const memUniqueIdFromEntity = global.decomposeGlobalUniqueID !== 'off'
  ? global.memUniqueIdFromEntity ? global.memUniqueIdFromEntity : (global.memUniqueIdFromEntity = {n: 0, collection: new Set()})
  : ({n: 0, collection: new Set()})

const uniqueIdFromEntity = (obj) => {
  if (!memUniqueIdFromEntity.collection.has(obj)) {
    memUniqueIdFromEntity.collection.add(obj)
    memUniqueIdFromEntity.n += 1
  }
  console.log(memUniqueIdFromEntity.n)
  return memUniqueIdFromEntity.n
}

function isObject (objArg) { return Object(objArg) === objArg }

function isFunction (proposal) { return typeof (proposal) === 'function' }

function getKeys (objArg) {
  return isObject(objArg) ? [].concat(Object.getOwnPropertySymbols(objArg), Object.getOwnPropertyNames(objArg)) : []
}

/**
 * @param {*}        objArg  - Object to decompose.
 * @param {Function} fn      - ¯\_(ツ)_/¯ 
 * @param {Array}    prefix  - Array to prefix.
 * @param {Set}      history - history to ignore setter on collection.
 *
 * @return {Array<{ '0': [String|Symbol], '1':* [, '2':Number] }>} Collection of the referencies
 */
function decompose (objArg, fn, prefix = [], history = new Set()) {
  let collection = []

  if (prefix.length === 0) {
    collection.push([ [], objArg ])
  }

  getKeys(objArg).forEach((index) => {
    const content = objArg[index]
    const _i = [].concat(prefix, index)

    if (!history.has(content)) {
      if (isObject(content)) history.add(content)

      const toPush = [_i, content]

      if (global.decomposeAssignUniqueID !== 'off') {
        toPush.push(uniqueIdFromEntity(content))
      }

      collection.push(toPush)

      if (typeof (content) === 'object') {
        const _o = decompose(content, fn, _i, history)

        collection = collection.concat(_o)
      }
    }
  })

  return collection
}

exports = module.exports = {
  __esModule: true,
  default: decompose,
  decompose
}
