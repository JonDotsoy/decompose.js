const toLower = require('lodash/toLower')
const toUpper = require('lodash/toUpper')
const padEnd = require('lodash/padEnd')
const max = require('lodash/max')
const isSymbol = require('lodash/isSymbol')
const {isObject} = require('./decompose')

function jsonStringify (obj) {
  const e = new Set()

  return JSON.stringify(obj, (name, value)=> {
    if (isObject(value) && e.has(value)) {
      return Object.create(value)
    } else {
      e.add(value)
      return value
    }
  })
}

function getType (obj) {
  return !obj ? null : obj.constructor ? obj.constructor.name : typeof(obj)
}

function pathToString (path) {
  const rtrn = path
  // parse Symbols
  .map((el) => {
    if (isSymbol(el)) {
      return `[${el.toString()}]`
    } else {
      const _el = el.toString()
      if (/\./.test(_el)) {
        return `[${_el}]`
      } else {
        return `${_el}`
      }
    }
  })
  .join('.')

  return `${rtrn}`
}

function loggerMD (decomposedObjArg) {
  const prelines = []
  const lines = []

  decomposedObjArg.forEach(([path, content, uniqueId]) => {
    prelines.push([
      pathToString(path),
      toUpper((uniqueId).toString(16)),
      jsonStringify(content),
      getType(content)
    ])
  })

  const strPath = 'path'
  const strUniqueId = 'Unique ID'
  const strContent = 'Content'
  const strType = 'Type'

  const withPath = [0].concat([[strPath]], prelines).reduce((n, [path]) => {
    return max([n, path.length])
  })

  const withUniqueID = [0].concat([[, strUniqueId]], prelines).reduce((n, [, uniqueId]) => {
    return max([n, String(uniqueId).length])
  })

  const withContent = [0].concat([[,, strContent]], prelines).reduce((n, [,, content]) => {
    return max([n, String(content).length])
  })

  const withType = [0].concat([[,,, strType]], prelines).reduce((n, [,,, type]) => {
    return max([n, String(type).length])
  })

  lines.push(`| ${padEnd(strPath, withPath)} | ${padEnd(strUniqueId, withUniqueID)} | ${padEnd(strType, withType)} | ${padEnd(strContent, withContent)} |`)
  lines.push(`| ${padEnd('', withPath, '-')} | ${padEnd('', withUniqueID, '-')} | ${padEnd('', withType, '-')} | ${padEnd('', withContent, '-')} |`)

  prelines.forEach(([path, uniqueId, content, type]) => {
    lines.push(`| ${padEnd(path, withPath)} | ${padEnd(uniqueId, withUniqueID)} | ${padEnd(type, withType)} | ${padEnd(content, withContent)} |`)
  })

  return lines.join('\n')
}

function logger (decomposedObjArg, format = 'md') {
  switch (toLower(format)) {
    case 'md': return loggerMD(decomposedObjArg)
    default: throw new TypeError('Format is not valid.')
  }
}

exports = module.exports = {
  __esModule: true,
  default: logger,
  loggerMD,
  logger
}

