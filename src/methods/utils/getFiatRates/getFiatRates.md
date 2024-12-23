---
id: getFiatRates
slug: /utils/getfiatrates
---

#### Description:

Returns the USD, EUR, GBP, CNY, JPY, KRW, AUD, SWISE exchange rates for the current network asset

#### Returns:

```ts
type Output = {
  'USD/EUR': number
  'USD/GBP': number
  'USD/CNY': number
  'USD/JPY': number
  'USD/KRW': number
  'USD/AUD': number
  'ASSET/USD': number
  'SWISE/USD': number
}
```

#### Example:

```ts
await sdk.utils.getFiatRates()
```
