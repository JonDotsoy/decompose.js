/**
 * Contiene la clase `Composition`, usado para representar una composición de un elemento.
 *
 * @module decompose.js/Composition
 * @example
 * import {Composition} from 'decompose.js'
 * import Composition from 'decompose.js/Composition'
 * const {Composition} = require('decompose.js')
 * const Composition = require('decompose.js/Composition')
 */

/**
 * Entidad que reprecenta una composición de elementos.
 * @prop {string|Symbol}            name      - Nombre de la propiedad que contiene el valor.
 * @prop {any}                      value     - contienen el puntero original al valor asignado.
 * @prop {(string|Symbol)[]}        path      - Tiene como referencia el recorrido hasta el valor
 *                                                del objeto root.
 * @prop {null|Object<string, any>} children  - Tiene como referencia los parametros del objeto.
 * @prop {any}                      reference - Contiene la referencia usado para contruir el
 *                                                elemento.
 * @example
 * decompose({a: 3}) // => Composition { reference: function Object() {}, value: {a: 3}, ... }
 */
export default class Composition {
  constructor () {
  }

  /**
   * Retornar el valor del elemento.
   * @example
   * // > composition
   * // Composition { reference: function Object() {...}, value: {a: 3}, ... }
   * composition.valueOf() // => {"a": 3}
   */
  valueOf() {}

  /**
   * Recorre todos los elementos del árbol.
   * @param {loaderCallback} load - Tras una iteración usara la función load para ver el elemento
   *                                recorrido.
   * @example
   * const composition = decompose({a: {b: 1, c: 3}})
   * 
   * composition.tree((value, name, path, comp, root) => {
   *     comp.value === value // => true
   *     comp.name === name // => true
   *     console.log(name, path, '=>', value)
   * })
   * // Out:
   * // null [] => {"a": {"b": 1, "c": 3}}
   * // a ['a'] => {"b": 1, "c": 3}
   * // b ['a', 'b'] => 1
   * // c ['a', 'c'] => 1
   */
  tree (loaderCallback: Function) {}

  /**
   * > Porque? necesito una forma de reconstruir el valor, de tal forma que me permita tener una
   * copia del elemento.
   * @return {any} Elemento copiado, usando como referencia el elemento padre.
   * @example
   * const original = {a: { b: 1, c: 2 }}
   * const composition = decompose()
   * 
   * const copia = composition.clone() // => Object
   * {
   *     a: {
   *         b: 1,
   *         c: 2
   *     }
   * }
   * 
   * original === copia // => false
   * original.a === copia.a // => false
   * original.a.b === copia.a.b // => true
   * original.a.c === copia.a.c // => true
   * 
   * // ref lodash
   * _.isEqual(original, copia) // => true
   */
  close () {}

  /**
   * > Porque? necesitamos saber si algo ha cambiado.
   *
   * > Ojo, que no solo evaluá los elementos que han cambiado respecto de la composición los
   * elementos nuevos no los reporta.
   * @param {any}      other             - Otro objeto el cual se quiere comparar.
   * @param {function} [reporter]        - Esta función nos ayudara a saber que a cambiado.
   * @param {boolean}  [stopFirst=false] - Si se detiene en cuanto encuentre un conflicto.
   * @example
   * const original = { a: {b: 1, c: 2} }
   * const composition = decompose(original)
   *
   * original.a.b = 3
   * original // => { a: {b: 3, c: 2} }
   *
   * const reporter = (value, name, path, comp, root) => {
   *   console.log(name, path, '=>', value)
   * }
   *
   * composition.diffOf(original, reporter) // => false
   * // Out:
   * // b ["a", "b"] => 4
   */
  diffOf (other: any, reporter: ?Function, stopFirst = false) {}
}

/**
 * Es usado para mostrar los elementos que recorre.
 *
 * @callback loaderCallback
 * @param {any}                  value - correspondera al valor real del objeto que esta
 *                                     recorreiendo.
 * @param {string|Symbol|null} name  - Corre al nombre del valor que esta recorriendo.
 * @param {(string|Symbol)[]}  path  - Este es un arreglo de los nombres asociado a todos las
 *                                     propiedades ancestros para poder llegar al valor.
 * @param {Composition}        comp  - Es la composición actual asociada al elemento entregado.
 * @param {Composition}        root  - Entrega el la composición padre.
 */
