import toLower from 'lodash/toLower'
import isFunction from 'lodash/isFunction'
import isNull from 'lodash/isNull'
import isRegExp from 'lodash/isRegExp'
import isNaN from 'lodash/isNaN'
import toUpper from 'lodash/toUpper'
import padEnd from 'lodash/padEnd'
import max from 'lodash/max'
import isSymbol from 'lodash/isSymbol'

// `decompose.ts` does not (yet) export `isObject` as a named export; this
// mirrors the existing (pre-migration) require so behavior is unchanged.
const { isObject } = require('./decompose')

type DecomposedEntry = [(string | symbol)[], any, number?]

const toTagCircular = (e?: string) => e ? `[Circular ${e}]` : '[Circular]'
const DEFAULT_TAG_CIRCULAR = toTagCircular()

function jsonStringify (obj: any, decomposedObjArg: DecomposedEntry[]): string {
  const e = new Set()

  if (isRegExp(obj)) return obj.toString()

  if (isSymbol(obj)) return obj.toString()
  if (isNaN(obj)) return 'NaN'
  if (isFunction(obj)) return obj.toString()

  const rtrn = JSON.stringify(obj, (name, value) => {
    if (isRegExp(value)) return `[[[REGEXP[${value.toString()}]]]]`
    if (isSymbol(value)) return `[[[SYMBOL[${value.toString()}]]]]`

    if (isObject(value) && e.has(value)) {
      const found = decomposedObjArg.find(([, content]) => content === value)
      const uid = found ? found[2] : undefined
      const uidStyled = toUpper((uid as any).toString(16))

      return toTagCircular(uidStyled)
    } else {
      e.add(value)
      return value
    }
  })

  return rtrn
    // To RegExp
    .replace(/\"\[\[\[REGEXP\[(.+?)\]\]\]\]\"/g, ' $1 ')
    // To Symbols
    .replace(/\"\[\[\[SYMBOL\[(.+?)\]\]\]\]\"/g, ' $1 ')
    // To Circular
    .replace(/\"(\[Circular [0-9|A-F]+?\])\"/g, ' $1 ')
}

function getType (obj: any): string {
  return isNull(obj)
    ? 'null'
    : isObject(obj)
      ? obj.constructor
        ? obj.constructor.name
        : typeof (obj)
      : typeof (obj)
}

function pathToString (path: (string | symbol)[]): string {
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

  return rtrn || '[]'
}

function loggerMD (decomposedObjArg: DecomposedEntry[], maxlengcontent: number = 40): string {
  const prelines: [string, string, string, string][] = []
  const lines: string[] = []

  decomposedObjArg.forEach(([path, content, uniqueId]) => {
    const uid = toUpper((uniqueId as any).toString(16))
    const preliteralString = String(jsonStringify(content, decomposedObjArg))

    const literalString = preliteralString.length >= maxlengcontent
      ? `${preliteralString.substring(0, maxlengcontent)}...`
      : preliteralString

    prelines.push([
      pathToString(path),
      uid,
      literalString,
      getType(content)
    ])
  })

  const strPath = 'Path'
  const strUniqueId = 'Unique ID'
  const strContent = 'Content'
  const strType = 'Type'

  const withPath: number = ([0] as any[]).concat([[strPath]], prelines).reduce((n: number, [path]: any) => {
    return max([n, path.length])
  })

  const withUniqueID: number = ([0] as any[]).concat([[, strUniqueId]], prelines).reduce((n: number, [, uniqueId]: any) => {
    return max([n, String(uniqueId).length])
  })

  const withContent: number = ([0] as any[]).concat([[, , strContent]], prelines).reduce((n: number, [, , content]: any) => {
    return max([n, String(content).length])
  })

  const withType: number = ([0] as any[]).concat([[, , , strType]], prelines).reduce((n: number, [, , , type]: any) => {
    return max([n, String(type).length])
  })

  lines.push(`| ${padEnd(strPath, withPath)} | ${padEnd(strUniqueId, withUniqueID)} | ${padEnd(strType, withType)} | ${padEnd(strContent, withContent)} |`)
  lines.push(`| ${padEnd('', withPath, '-')} | ${padEnd('', withUniqueID, '-')} | ${padEnd('', withType, '-')} | ${padEnd('', withContent, '-')} |`)

  prelines.forEach(([path, uniqueId, content, type]) => {
    const contentSyled = content

    lines.push(`| ${padEnd(path, withPath)} | ${padEnd(uniqueId, withUniqueID)} | ${padEnd(type, withType)} | ${padEnd(contentSyled, withContent)} |`)
  })

  return lines.join('\n')
}

export function logger (decomposedObjArg: DecomposedEntry[], format: string = 'md'): string {
  switch (toLower(format)) {
    case 'md': return loggerMD(decomposedObjArg)
    default: throw new TypeError('Format is not valid.')
  }
}

export { loggerMD }
export default logger
