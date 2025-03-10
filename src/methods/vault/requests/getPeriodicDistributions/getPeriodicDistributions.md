---
id: getPeriodicDistributions
slug: /vault/requests/getperiodicdistributions
---

#### Description:

Getting the periodic distribution of additional incentives

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
}>
```

| Name                | Description             |
|---------------------|-------------------------|
| `apy` | The average weekly apy of the distribution |
| `token` | The address of the token that is distributed |

#### Example:

```ts
await sdk.vault.getPeriodicDistributions({
  userAddress: '0x...',
  endTimestamp: 1741346116,
  startTimestamp: 1741346116,
})
```
