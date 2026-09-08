# decompose.js

Esta es una herramienta que descomponer un objeto de JavaScript.

> Este documento tiene como objetivo el explicar le funcionamiento del proyecto, funcionando como una guía de casos y ejemplos en donde ademas son usados para el desarrollo del mismo.

**Contenido:**

- [decompose()][]
- [Otros módulos](#otros-módulos)
- [Referencia de la API](../api/README.md) — generada con [TypeDoc](https://typedoc.org/) (`bun run doc`).

[decompose()]: #function-decompose--
## function decompose (objArg) {}
Esta función descompone recursivamente `objArg` en una lista plana de entradas
`[path, value]` — una por cada propiedad propia (incluyendo símbolos)
alcanzable desde `objArg`, más una entrada raíz con `path: []`.

Ejemplo.

```javascript
decompose({ a: { b: 0 }, c: [1, 3] }) // =>
[
  [ []          , { a: { b: 0 }, c: [1, 3] } ],
  [ ['a']       , { b: 0 }                   ],
  [ ['a', 'b']  , 0                          ],
  [ ['c']       , [1, 3]                     ],
  [ ['c', '0']  , 1                          ],
  [ ['c', '1']  , 3                          ],
  [ ['c', 'length'], 2                       ]
]
```

Los valores que son objetos o arrays conservan su referencia original: mutar
uno de ellos se refleja en cualquier otra entrada que apunte al mismo objeto.
Las referencias circulares se recorren una sola vez.

> ℹ️ `Composition` (`src/Composition.ts`) es un stub para una futura dirección
> de la API — hoy `decompose()` no la usa ni la retorna. Ver el
> [README raíz](../../README.md#development-status) para más detalle.

## Otros módulos

Además de `decompose()`, el paquete expone otros módulos por subpath (ver
[`package.json`'s `exports`](../../package.json)):

- **`decompose.js/expect`** — un pequeño helper de asserts semántico
  (`expect(valor).eq(otro)`, `.to.eql(otro)`, `.not.to.eq(otro)`, etc.)
  construido sobre `decompose()`, usado en los propios tests del proyecto.
- **`decompose.js/logger`** — convierte una lista descompuesta en una tabla
  Markdown (`logger(decompose(obj))`), útil para depurar visualmente el
  resultado de `decompose()`.
- **`decompose.js/decompose-old`** — la implementación previa a la reescritura
  de `decompose()`, que se mantiene solo como referencia histórica.

Ver la [referencia de la API](../api/README.md) para el detalle de cada
función y tipo.

