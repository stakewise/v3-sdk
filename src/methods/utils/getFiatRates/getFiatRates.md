---
id: getFiatRates
---

#### Description:

Returns the USD, EUR, GBP exchange rates for the current asset

#### Returns:

```ts
type Output = {
  assetsUsdRate: number
  usdToEurRate: number
  usdToGbpRate: number
}
```

#### Example:

```ts
await sdk.utils.getFiatRates()
```
