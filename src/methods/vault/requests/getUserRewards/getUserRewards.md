---
id: getUserRewards
slug: /vault/requests/getuserrewards
---

#### Description:

Daily rewards for the user who has made a deposit in the vault.

#### Arguments:

| Name         | Type     | Required | Description                   |
|--------------|----------|----------|-------------------------------|
| dateFrom     | `number` | **Yes**  | Time to start in milliseconds |
| dateTo       | `number` | **Yes**  | Time to end  in milliseconds  |
| userAddress  | `string` | **Yes**  | The user address              | 
| vaultAddress | `string` | **Yes**  | The address of the vault      | 

#### Returns:

```ts
type Output = {
  date: number
  dailyRewards: number
  dailyRewardsEur: number
  dailyRewardsGbp: number
  dailyRewardsUsd: number
}
```

| Name | Description               |
|------|---------------------------|
| `date` | Сurrent rate date         |
| `dailyRewards` | Daily reward asset in ETH |
| `dailyRewardsEur` | Daily reward asset in EUR |
| `dailyRewardsGbp` | Daily reward asset in GBP |
| `dailyRewardsUsd` | Daily reward asset in USD |

#### Example:

```ts
await sdk.vault.getUserRewards({
  userAddress: '0x...',
  vaultAddress: '0x...',
  dateTo: 1727827200000,
  dateFrom: 1721606400000,
})
```
