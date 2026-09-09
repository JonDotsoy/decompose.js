import isSymbol from 'lodash/isSymbol'
import uniqueId from 'lodash/uniqueId'
import { decompose, type PathSegment, type DecomposedEntry } from './decompose'

export type { PathSegment, DecomposedEntry }

const listToSymbols = new Map<symbol, string>()

function normalizePath (pathArr: PathSegment[]): string {
  return pathArr.map(e => {
    if (isSymbol(e)) {
      const sym = e as symbol
      if (!listToSymbols.has(sym)) listToSymbols.set(sym, `@@SYMBOL(${uniqueId()})`)
      return listToSymbols.get(sym)
    } else {
      return `[${e.toString()}]`
    }
  }).join('.')
}

export function eql (deObjArg: DecomposedEntry[], deCompareObjArg: DecomposedEntry[]): boolean {
  if (deObjArg.length !== deCompareObjArg.length) return false

  return ([true] as any[]).concat(deObjArg).reduce((e: any, [path, value]: any) => {
    if (e === false) return false
    const normPath = normalizePath(path)

    const found = deCompareObjArg.find(([proposalComporePath]) => {
      return normPath === normalizePath(proposalComporePath)
    })
    const compareValue = found ? found[1] : undefined

    return compareValue === value
  })
}

export function expect (objArg: any) {
  const value = decompose(objArg)

  const eq = (compare: any) => eql(value, decompose(compare))

  const eqThrow = (compare: any) => {
    if (!eq(compare)) {
      throw new Error(`The value (${JSON.stringify(objArg)}) is not equals to compare (${JSON.stringify(compare)}).`)
    }
  }

  const notEqThrow = (compare: any) => {
    if (eq(compare)) {
      throw new Error(`The value (${value}) is equals to compare (${compare}).`)
    }
  }

  const semanticNotEq = {
    eq: notEqThrow,
    eql: notEqThrow,
    toEq: notEqThrow,
    toEql: notEqThrow,
    toToEql: notEqThrow,
    to: {
      eq: notEqThrow,
      notEq: notEqThrow,
      eql: notEqThrow,
      notEql: notEqThrow
    }
  }

  const semanticEq = {
    eq: eqThrow,
    eql: eqThrow,
    toEq: eqThrow,
    toEql: eqThrow,
    to: {
      eq: eqThrow,
      eql: eqThrow,
      not: semanticNotEq
    },
    notEq: notEqThrow,
    notEql: notEqThrow,
    notToEq: notEqThrow,
    notToEql: notEqThrow,
    not: semanticNotEq
  }

  return semanticEq
}

export default expect
