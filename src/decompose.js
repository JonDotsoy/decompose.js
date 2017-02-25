function isObject (objArg) { return Object(objArg) === objArg }

function isFunction (proposal) { return typeof (proposal) === 'function' }

function getKeys (objArg) {
  return isObject(objArg) ? [].concat(Object.getOwnPropertySymbols(objArg), Object.getOwnPropertyNames(objArg)) : []
}

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

      collection.push([_i, content])

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
