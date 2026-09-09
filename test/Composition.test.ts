import Composition from '../src/Composition'
import { describe, it, expect } from 'bun:test'

/*

# Composition

Composition es una clase que manejara las herramientas de desarrollo.

`Composition` es hoy un stub: cada método existe (con la firma documentada
en su JSDoc) pero su cuerpo está vacío, a la espera de una futura API que
`decompose()` todavía no usa (ver "Development status" en el README raíz).
Estos tests no verifican comportamiento -- documentan la forma pública de
la clase y le dan cobertura mientras sigue sin implementarse.

*/
describe('Composition', function () {
  it('Type Composition', () => {

  })

  it('is constructible and returns undefined from every stub method', () => {
    const composition = new Composition()

    expect(composition).toBeInstanceOf(Composition)
    expect(composition.valueOf()).toBeUndefined()
    expect(composition.tree(() => {})).toBeUndefined()
    expect(composition.close()).toBeUndefined()
    expect(composition.diffOf({})).toBeUndefined()
    expect(composition.diffOf({}, () => {}, true)).toBeUndefined()
  })
})
