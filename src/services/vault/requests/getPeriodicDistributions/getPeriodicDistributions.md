---
id: getPeriodicDistributions
slug: /sdk/api/vault/requests/getperiodicdistributions
description: Use the StakeWise SDK getPeriodicDistributions method to fetch periodic distribution data for additional vault incentives.
---

#### Description:

Getting the periodic distribution of additional incentives

Returns the distributions that started no later than `startTimestamp` and end no earlier than `endTimestamp`: `startTimestamp` is the upper bound and `endTimestamp` the lower bound of the overlap window.

#### Arguments:

| Name         | Type     | Required | Description               |
|--------------|----------|----------|---------------------------|
| vaultAddress | `string` | **Yes**  | The address of the vault |
| endTimestamp  | `number` | **Yes**  | The timestamp when the distribution ends |
| startTimestamp  | `number` | **Yes**  | The timestamp when the distribution starts |

#### Returns:

```ts
type Output = Array<{
  apy: string
  token: string
  endTimestamp: string
}>
```

| Name                | Description             |
|---------------------|-------------------------|
| `apy` | The average weekly apy of the distribution |
| `token` | The address of the token that is distributed |
| `endTimestamp` | The timestamp when the distribution ends |

#### Example:

```ts
await sdk.vault.getPeriodicDistributions({
  vaultAddress: '0x...',
  endTimestamp: 1741346116,
  startTimestamp: 1741346116,
})
```
