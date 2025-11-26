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
  dailyRewardsUsd: number
  dailyRewardsEur: number
  dailyRewardsGbp: number
  dailyRewardsCny: number
  dailyRewardsJpy: number
  dailyRewardsKrw: number
  dailyRewardsAud: number
}
```

| Name              | Description               |
|-------------------|---------------------------|
| `date`            | Сurrent rate date         |
| `dailyRewards`    | Daily reward asset in ETH |
| `dailyRewardsUsd` | Daily reward asset in USD |
| `dailyRewardsEur` | Daily reward asset in EUR |
| `dailyRewardsGbp` | Daily reward asset in GBP |
| `dailyRewardsCny` | Daily reward asset in CNY |
| `dailyRewardsJpy` | Daily reward asset in JPY |
| `dailyRewardsKrw` | Daily reward asset in KRW |
| `dailyRewardsAud` | Daily reward asset in AUD |

#### Example:

```ts
await sdk.vault.getUserRewards({
  userAddress: '0x...',
  vaultAddress: '0x...',
  dateTo: 1727827200000,
  dateFrom: 1721606400000,
})
```
