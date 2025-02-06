---
id: getVaultStats
slug: /vault/requests/getvaultstats
---

#### Description:

Getting the vault stats collection. With the help of this data it is possible to build a chart.

#### Arguments:

| Name   | Type     | Required | Description              |
|--------|----------|----------|--------------------------|
| daysCount  | `number` | **Yes**  | The limit in days        |
| vaultAddress | `string` | **Yes**  | The address of the vault | 

#### Returns:

```ts
type Output = {
  apy: number
  time: number
  balance: number
  rewards: number
}
```

| Name      | Description                                              |
|-----------|----------------------------------------------------------|
| `time`    | Date and time for each data point                        |
| `apy`     | Current APY based on time, rewards and balance.          |
| `rewards` | Number of assets earned by the vault during the interval |
| `balance` | Total assets in the vault at the moment of time          |

#### Example:

```ts
await sdk.vault.getVaultStats({
  daysCount: 30,
  vaultAddress: '0x...',
})
```
