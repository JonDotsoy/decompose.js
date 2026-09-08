# Function: default()

> **default**(`value`, `opts?`): `void` \| [`default`](../../Composition/classes/default.md)

Defined in: [decompose.ts:23](https://github.com/JonDotsoy/decompose.js/blob/master/src/decompose.ts#L23)

Este función lee un elemento y la descompone para retornar una composición del mismo.

## Parameters

### value

`unknown`

Valor para descomponer

### opts?

[`DecomposeOptions`](../interfaces/DecomposeOptions.md) = `{}`

alguna propiedades

## Returns

`void` \| [`default`](../../Composition/classes/default.md)

Retorna la composición del elemento.

## Example

```ts
decompose(3) // => Composition { reference: function Number() {...}, value: 3 }
```
