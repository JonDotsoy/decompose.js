# decompose.js 🎼

[![Test](https://github.com/JonDotsoy/decompose.js/actions/workflows/test.yml/badge.svg)](https://github.com/JonDotsoy/decompose.js/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/decompose.js.svg)](https://www.npmjs.com/package/decompose.js)

Decompose a JavaScript object into a flat list of `[path, value]` entries — walk
every nested property once, know exactly where each value lives, and keep a
pointer to the original references.

> Why? In some cases it is necessary to inspect an object in depth and have the
> full value despite being able to modify it later. This project is well suited
> for inspecting an object in depth and detailing all its values.

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Package exports](#package-exports)
- [Development](#development)
- [Development status](#development-status)
- [Inspiration](#inspiration)

## Installation

```sh
npm install decompose.js
```

## Usage

The package ships CommonJS, ESM, and TypeScript type declarations for every
entry point, so it works the same way regardless of your module system.

```javascript
// CommonJS
const { decompose } = require('decompose.js')
```

```typescript
// ESM / TypeScript
import decompose from 'decompose.js'
```

```javascript
const myObj = { a: { b: 0 }, c: [ { d: 1 }, { e: true } ] }

decompose(myObj) // => Array
// [
//   [ []             , {"a":{"b":0},"c":[{"d":1},{"e":true}]} ],
//   [ ["a"]          , {"b":0}                                ],
//   [ ["a","b"]      , 0                                      ],
//   [ ["c"]          , [{"d":1},{"e":true}]                   ],
//   [ ["c","0"]      , {"d":1}                                ],
//   [ ["c","0","d"]  , 1                                      ],
//   [ ["c","1"]      , {"e":true}                             ],
//   [ ["c","1","e"]  , true                                   ],
//   [ ["c","length"] , 2                                      ]
// ]
```

Each entry is `[path, value]`, where `path` is the array of keys (as strings or
symbols) needed to reach `value` from the root object. Values that are objects
or arrays keep their original references, so mutating one is reflected
wherever else it appears in the decomposed list.

## API

Full generated API reference is available in [`docs/api/`](docs/api/README.md)
(generated from the TypeScript source with [TypeDoc](https://typedoc.org/) —
run `bun run doc` to regenerate it), with an accompanying
[Spanish usage guide](docs/es/README.md). Summary:

| Export | Description |
| --- | --- |
| `decompose(objArg)` | Default export. Decomposes `objArg` into a flat `[path, value]` list, as shown above. |
| `isObject(objArg)` | The `Object(objArg) === objArg` predicate `decompose()` uses to decide what to recurse into. See [`src/decompose.ts`](src/decompose.ts). |
| `Composition` | A tree/diff-aware entity for a future API direction; not used by `decompose()` today, and still an unimplemented stub. See [`src/Composition.ts`](src/Composition.ts). |
| `expect(value)` | A small semantic assertion helper built on top of `decompose()`, used in this project's own tests. See [`src/expect.ts`](src/expect.ts). |
| `logger(decomposedObj, format?)` | Renders a decomposed list as a Markdown table (`format: 'md'`, the only format supported today). See [`src/logger.ts`](src/logger.ts). |
| `decompose-old` | The pre-rewrite implementation of `decompose()`, kept only as a historical reference now that `decompose.ts` has its own (fixed) implementation — see [Development status](#development-status). See [`src/decompose-old.ts`](src/decompose-old.ts). |

## Package exports

Every module is a separate entry point, importable directly by subpath:

```javascript
const { decompose } = require('decompose.js')
const Composition = require('decompose.js/Composition')
const { expect } = require('decompose.js/expect')
const { logger } = require('decompose.js/logger')
const { decompose: decomposeOld } = require('decompose.js/decompose-old')
```

The same subpaths work with `import` and resolve to `.d.ts` type declarations.

## Development

The project is written in TypeScript and built with [Bun](https://bun.sh):

```sh
bun install       # install dependencies
bun run build     # compile src/*.ts to CJS + ESM + .d.ts at the package root
bun run typecheck # type-check src/ and test/ with tsc (no emit)
bun test          # run the test suite (test/*.test.ts, using bun's built-in test runner)
bun run test      # typecheck, then bun test — what CI runs
bun run doc       # regenerate docs/api/ from src/*.ts with TypeDoc
```

`bun run build` compiles each entry point (`decompose`, `expect`, `logger`,
`Composition`, `decompose-old`) separately into `<name>.js` (CommonJS),
`<name>.mjs` (ESM), and `<name>.d.ts` (types) at the repository root; those
compiled files are gitignored and only produced on build/publish.

[`test/types.test.ts`](test/types.test.ts) holds compile-time type tests
written with `expectTypeOf` from `bun:test`. Each case is declared with
`it.skip` on purpose: bun's `expectTypeOf().parameter(n)` returns `undefined`
at runtime (the value only exists for TypeScript to narrow at compile time),
so actually running those bodies would throw. `it.skip` still gets
type-checked by `tsc` — that's what `bun run typecheck` enforces — while
showing up as skipped, not failing, under `bun test`.

Pull requests are checked by [`test.yml`](.github/workflows/test.yml), which
runs the unit tests (and type tests) with `bun run test` and also smoke-tests installing the
package both from the npm registry and from a local `npm pack` tarball.

## Development status

`decompose()` in `src/decompose.ts` re-implements the algorithm that used to
live directly in `decompose.ts` before this `develop` branch started
rewriting it (now preserved, unchanged, at
[`src/decompose-old.ts`](src/decompose-old.ts)), with one deliberate fix: by
default (i.e. without touching the `global.decomposeGlobalUniqueID` /
`global.decomposeAssignUniqueID` switches described below), `decompose-old`'s
lazily-created id-tracking store is a `Set` that its own code then calls
`.set()` on — a `Set` has no `.set()` method, so the very first nested object
throws `TypeError: ... .set is not a function`. `decompose.ts` always uses a
`Map` there instead, and only assigns unique ids when a caller explicitly
opts in with `global.decomposeAssignUniqueID = 'on'`.

Those two globals are a legacy, process-wide mechanism (inherited from
`decompose-old.ts`) for the rarely-needed case of tagging every decomposed
entry with a stable id shared across nested/circular references — used by
this project's own logger tests. Everyday use of `decompose(value)` never
needs to touch them.

## Inspiration

Read the next publication on [stackoverflow][stackoverflow-questions-8318357].
Would not it be great to know everything about an object? — This library
allows it!!.

[stackoverflow-questions-8318357]: http://stackoverflow.com/questions/8318357/javascript-pointer-reference-craziness-can-someone-explain-this "Javascript pointer/reference craziness. Can someone explain this?"
