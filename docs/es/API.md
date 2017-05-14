## decompose(value)
A la función `decompose` le entregamos una parámetro con el valor que queremos
transformar en una composición.

**Argumentos**

* `value` **(any)**: Valor para descomponer.

**Retorno**

* **(Composition)**: Retorna la composición del elemento.

**Ejemplo**

```javascript
decompose(3) // => Composition { reference: function Number() {...}, value: 3 }
```


## Composition.prototype.valueOf()
Retornar el valor del elemento.

**Ejemplo**

```javascript
// > composition
// Composition { reference: function Object() {...}, value: {a: 3}, ... }
composition.valueOf() // => {"a": 3}
```


## Composition.prototype.tree(load)
Recorre todos los elementos del arbol.

* `load` **(function)**: Tras una iteración usara la funcion load para ver el elemento recorrido.
    - `value` **(any)**: correspondera al valor real del objeto que esta recorreiendo.
    - `name` **(string|Symbol|null)**: Corre al nombre del valor que esta recorriendo.
    - `path` **((string|Symbol)[])**: Este es un arreglo de los nombres asociado a todos las propiedades ancestros para poder llegar al valor.
    - `comp` **(Composition)**: Es la composición actual asociada al elemento entregado.
    - `root` **(Composition)**: Entrega el la composición padre.

**Ejemplo**

```javascript
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

## Composition.prototype.clone()
> Porque? necestio una forma de recontruir el valor, de tal forma que me permita tener una copia del elemento.

**Retorno**

* **(Object)**: Elemento copiado, usando como referencia el elemento padre.

**Ejemplo**

```javascript
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

## Composition.prototype.diffOf(other[, reporter[, stopFirst = false]])
> Porque? necesitamos saver si algo ha cambiado.

> Ojo, que no solo evalua los elementos que an cambiado respecto de la composición los elementos nuevos no los reporta.

**Argumentos**

* `other` **(any)**: Reprecenta otro objeto el cual se quiere comparar.
* `reporter` **(function)**: Esta función nos ayudara a saber que a cambiado.

**Ejemplo**

```javascript
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

