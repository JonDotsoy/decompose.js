/**
 * @module decompose.js
 * @example
 * import decompose from 'decompose.js'
 * const decompose = require('decompose.js').default
 */

/**
 * Este función lee un elemento y la descompone para retornar una composición del mismo.
 *
 * @param {*}       Object - Valor para descomponer
 * @param {object}  [opts] - alguna propiedades
 * @param {boolean} [opts.isOk=false] - is ok.
 * @return {Composition} Retorna la composición del elemento.
 * @example
 * decompose(3) // => Composition { reference: function Number() {...}, value: 3 }
 */
export default function decompose () {
}
