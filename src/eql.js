const isSymbol = require('lodash/isSymbol')
const uniqueId = require('lodash/uniqueId')
const {decompose} = require('./decompose')

const listToSymbols = new Map()

function normalizePath (pathArr) {
  return pathArr.map(e=> {
    if (isSymbol(e)) {
      if (!listToSymbols.has(e)) listToSymbols.set(e, `@@SYMBOL(${uniqueId()})`)
      return listToSymbols.get(e)
    } else {
      return `[${e.toString()}]`
    }
  }).join('.')
}

function eql (deObjArg, deCompareObjArg) {

  if (deObjArg.length !== deCompareObjArg.length) return false

  return [true].concat(deObjArg).reduce((e,[path, value]) => {
    if (e===false) return false
    const normPath = normalizePath(path)

    const [,compareValue] = deCompareObjArg.find(([proposalComporePath, proposalComporeValue]) => {
      return normPath === normalizePath( proposalComporePath )
    })

    return compareValue === value
  })

}

exports = module.exports = {
  __esModule: true,
  default: eql,
  eql
}

