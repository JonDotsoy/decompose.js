# decompose.js

Esta es una herramienta que descomponer un objeto de JavaScript.

> Este documento tiene como objetivo el explicar le funcionamiento del proyecto, funcionando como una guía de casos y ejemplos en donde ademas son usados para el desarrollo del mismo.

> ⚠️ En esta rama (`develop`), `decompose()` (`src/decompose.ts`) es todavía un
> stub sin implementar. Los ejemplos de esta guía describen el comportamiento
> previsto (el mismo que la versión publicada en npm), no lo que hoy retorna
> el código fuente de esta rama.

**Contenido:**

- [decompose()][]
- [composición][]
- [Otros módulos](#otros-módulos)
- [Referencia de la API](../api/README.md) — generada con [TypeDoc](https://typedoc.org/) (`bun run doc`).

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

## Otros módulos

Además de `decompose()` y `Composition`, el paquete expone otros módulos por
subpath (ver [`package.json`'s `exports`](../../package.json)):

- **`decompose.js/expect`** — un pequeño helper de asserts semántico
  (`expect(valor).eq(otro)`, `.to.eql(otro)`, `.not.to.eq(otro)`, etc.)
  construido sobre `decompose()`, usado en los propios tests del proyecto.
- **`decompose.js/logger`** — convierte una lista descompuesta en una tabla
  Markdown (`logger(decompose(obj))`), útil para depurar visualmente el
  resultado de `decompose()`.
- **`decompose.js/decompose-old`** — la implementación anterior de
  `decompose()`, completamente funcional, que se mantiene como referencia
  mientras se reescribe `decompose.ts`.

Ver la [referencia de la API](../api/README.md) para el detalle de cada
función y tipo.

