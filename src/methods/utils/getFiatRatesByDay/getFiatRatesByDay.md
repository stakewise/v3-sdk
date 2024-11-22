---
id: getFiatRatesByDay
---

#### Description:

Get fiat data by day

#### Arguments:

| Name     | Type     | Required | Description      |
|----------|----------|----------|------------------|
| dateTo   | `string` | **Yes**  | Start time       |
| dateFrom | `string` | **Yes**  | End time         |

#### Returns:

```ts
type Output = Array<{
  timestamp: string
  usdToEurRate: string
  usdToGbpRate: string
  assetsUsdRate: string
}>
```

#### Example:

```ts
await sdk.utils.getFiatRatesByDay({ dateTo, dateFrom })
```
