# Class: default

Defined in: [Composition.ts:33](https://github.com/JonDotsoy/decompose.js/blob/master/src/Composition.ts#L33)

Entidad que reprecenta una composición de elementos.

## Example

```ts
decompose({a: 3}) // => Composition { reference: function Object() {}, value: {a: 3}, ... }
```

## Constructors

### Constructor

> **new default**(): `Composition`

Defined in: [Composition.ts:34](https://github.com/JonDotsoy/decompose.js/blob/master/src/Composition.ts#L34)

#### Returns

`Composition`

## Methods

### close()

> **close**(): `void`

Defined in: [Composition.ts:90](https://github.com/JonDotsoy/decompose.js/blob/master/src/Composition.ts#L90)

> Porque? necesito una forma de reconstruir el valor, de tal forma que me permita tener una
copia del elemento.

#### Returns

`void`

Elemento copiado, usando como referencia el elemento padre.

#### Example

```ts
const original = {a: { b: 1, c: 2 }}
const composition = decompose()

const copia = composition.clone() // => Object
{
    a: {
        b: 1,
        c: 2
    }
}

original === copia // => false
original.a === copia.a // => false
original.a.b === copia.a.b // => true
original.a.c === copia.a.c // => true

// ref lodash
_.isEqual(original, copia) // => true
```

***

### diffOf()

> **diffOf**(`other`, `reporter?`, `stopFirst?`): `void`

Defined in: [Composition.ts:115](https://github.com/JonDotsoy/decompose.js/blob/master/src/Composition.ts#L115)

> Porque? necesitamos saber si algo ha cambiado.

> Ojo, que no solo evaluá los elementos que han cambiado respecto de la composición los
elementos nuevos no los reporta.

#### Parameters

##### other

`any`

Otro objeto el cual se quiere comparar.

##### reporter?

[`LoaderCallback`](../type-aliases/LoaderCallback.md)

Esta función nos ayudara a saber que a cambiado.

##### stopFirst?

`boolean` = `false`

Si se detiene en cuanto encuentre un conflicto.

#### Returns

`void`

#### Example

```ts
const original = { a: {b: 1, c: 2} }
const composition = decompose(original)

original.a.b = 3
original // => { a: {b: 3, c: 2} }

const reporter = (value, name, path, comp, root) => {
  console.log(name, path, '=>', value)
}

composition.diffOf(original, reporter) // => false
// Out:
// b ["a", "b"] => 4
```

***

### tree()

> **tree**(`loaderCallback`): `void`

Defined in: [Composition.ts:64](https://github.com/JonDotsoy/decompose.js/blob/master/src/Composition.ts#L64)

Recorre todos los elementos del árbol.

#### Parameters

##### loaderCallback

[`LoaderCallback`](../type-aliases/LoaderCallback.md)

Tras una iteración usara la función load para ver el elemento
                        recorrido.

#### Returns

`void`

#### Example

```ts
const composition = decompose({a: {b: 1, c: 3}})

composition.tree((value, name, path, comp, root) => {
    comp.value === value // => true
    comp.name === name // => true
    console.log(name, path, '=>', value)
})
// Out:
// null [] => {"a": {"b": 1, "c": 3}}
// a ['a'] => {"b": 1, "c": 3}
// b ['a', 'b'] => 1
// c ['a', 'c'] => 1
```

***

### valueOf()

> **valueOf**(): `void`

Defined in: [Composition.ts:44](https://github.com/JonDotsoy/decompose.js/blob/master/src/Composition.ts#L44)

Retornar el valor del elemento.

#### Returns

`void`

#### Example

```ts
// > composition
// Composition { reference: function Object() {...}, value: {a: 3}, ... }
composition.valueOf() // => {"a": 3}
```
