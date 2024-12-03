---
id: getFiatRates
slug: /utils/getfiatrates
---

#### Description:

Returns the USD, EUR, GBP, SWISE exchange rates for the current network asset

#### Returns:

```ts
type Output = {
  'USD/EUR': number
  'USD/GBP': number
  'ASSET/USD': number
  'SWISE/USD': number
}
```

#### Example:

```ts
await sdk.utils.getFiatRates()
```
