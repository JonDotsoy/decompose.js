# decompose.js

Esta es una herramienta que descomponer un objeto de JavaScript.

> Este documento tiene como objetivo el explicar le funcionamiento del proyecto, funcionando como una guía de casos y ejemplos en donde ademas son usados para el desarrollo del mismo.

**Contenido:**

- [Compositor][]


[Compositor]: #compositor
## Compositor 🎼
Este objeto es una representación de una estructura de un objeto, **manteniendo el puntero de la memoria** original.

Ej.

```javascript
Composition {
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
    reference: function Array () {...},
    value: [ 1, 3, 6 ],
    children: {
        "0": Composition {reference: function Number () {...}, value: 1}
        "1": Composition {reference: function Number () {...}, value: 3}
        "2": Composition {reference: function Number () {...}, value: 6}
    }
}
```



[Object.prototype.constructor]: https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/constructor

