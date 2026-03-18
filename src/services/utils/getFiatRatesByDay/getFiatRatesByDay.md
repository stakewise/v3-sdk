---
id: getFiatRatesByDay
slug: /sdk/api/utils/getfiatratesbyday
description: Use the StakeWise SDK getFiatRatesByDay utility to retrieve historical daily fiat exchange rates for a date range.
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
  usdToCnyRate: string
  usdToJpyRate: string
  usdToKrwRate: string
  usdToAudRate: string
  assetsUsdRate: string
}>
```

#### Example:

```ts
await sdk.utils.getFiatRatesByDay({ dateTo, dateFrom })
```
