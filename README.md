> **⚠️ Status: work in progress.** This is the `develop` branch. `decompose()` in
> [`src/decompose.ts`](src/decompose.ts) is currently an unimplemented stub — the
> examples below describe the intended/published behavior, not what `bun test`
> reports on this branch today. See [Development status](#development-status).

---

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
| `decompose(value, opts?)` | Default export. Decomposes `value` into a `Composition`. |
| `Composition` | The tree/diff-aware entity returned by `decompose()`. See [`src/Composition.ts`](src/Composition.ts). |
| `expect(value)` | A small semantic assertion helper built on top of `decompose()`, used in this project's own tests. See [`src/expect.ts`](src/expect.ts). |
| `logger(decomposedObj, format?)` | Renders a decomposed list as a Markdown table (`format: 'md'`, the only format supported today). See [`src/logger.ts`](src/logger.ts). |
| `decompose-old` | The previous, fully working implementation of `decompose()`, kept as a reference while `decompose.ts` is being rewritten. See [`src/decompose-old.ts`](src/decompose-old.ts). |

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

This `develop` branch is mid-refactor: `decompose()` in `src/decompose.ts` is
an empty stub pending a rewrite, while [`src/decompose-old.ts`](src/decompose-old.ts)
keeps the previous working implementation for reference. Because of this,
most of the ported test scenarios in `test/decompose.test.ts` currently fail
under `bun test` — that reflects the state of this branch, not a regression
in the build or test tooling. The examples in this README describe the
intended (and currently published, npm registry) behavior.

## Inspiration

Read the next publication on [stackoverflow][stackoverflow-questions-8318357].
Would not it be great to know everything about an object? — This library
allows it!!.

[stackoverflow-questions-8318357]: http://stackoverflow.com/questions/8318357/javascript-pointer-reference-craziness-can-someone-explain-this "Javascript pointer/reference craziness. Can someone explain this?"
