import type Composition from './Composition'

/**
 * @module decompose.js
 * @example
 * import decompose from 'decompose.js'
 * const decompose = require('decompose.js').default
 */

export interface DecomposeOptions {
  isOk?: boolean
}

/**
 * Este función lee un elemento y la descompone para retornar una composición del mismo.
 *
 * @param value  - Valor para descomponer
 * @param opts   - alguna propiedades
 * @return Retorna la composición del elemento.
 * @example
 * decompose(3) // => Composition { reference: function Number() {...}, value: 3 }
 */
export default function decompose (value: unknown, opts: DecomposeOptions = {}): Composition | void {

}
