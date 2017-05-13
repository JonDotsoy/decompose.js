# decompose.js

Esta es una herramienta que descomponer un objeto de JavaScript.

> Este documento tiene como objetivo el explicar le funcionamiento del proyecto, funcionando como una guía de casos y ejemplos en donde ademas son usados para el desarrollo del mismo.

**Contenido:**

- [decompose()][]
- [composición][]

[decompose()]: #function-decompose--
## function decompose () {}
Esta es una función que nos ayuda a crear una [composición][] de un objeto. 

Ejemplo.

```javascript
decompose([1, 3, 6]) // =>
Composition {
    name: null,
    reference: function Array () {...},
    value: [ 1, 3, 6 ],
    children: {
        "0": Composition {name: "0", reference: function Number () {...}, value: 1}
        "1": Composition {name: "1", reference: function Number () {...}, value: 3}
        "2": Composition {name: "2", reference: function Number () {...}, value: 6}
    }
}
```

[composición]: #compositor-
[Compositor]: #compositor-
## Compositor 🎼
Este objeto es una representación de una estructura de un objeto, **manteniendo el puntero de la memoria** original.

Ejemplo.

```javascript
Composition {
    name: ...,
    reference: function Object() {...},
    value: ...,
    children: {
        ...
    }
}
```

> Porque `reference` y no `constructor`? la palabra `constructor` que ya es usada en JavaScript. Por favor lea [Object.prototype.constructor][] en la documentación de mozilla.

Otro ejemplo.

```javascript
// From: [1, 3, 6]
Composition {
    name: null,
    reference: function Array () {...},
    value: [ 1, 3, 6 ],
    children: {
        "0": Composition {name: "0", reference: function Number () {...}, value: 1}
        "1": Composition {name: "1", reference: function Number () {...}, value: 3}
        "2": Composition {name: "2", reference: function Number () {...}, value: 6}
    }
}
```



[Object.prototype.constructor]: https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/constructor

