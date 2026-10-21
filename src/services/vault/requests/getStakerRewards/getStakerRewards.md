---
id: getStakerRewards
slug: /sdk/api/vault/requests/getstakerrewards
description: Use the StakeWise SDK getStakerRewards method to fetch daily net staker rewards within a specified date range.
---

#### Description:

Daily net rewards for the staker across the wallet, mint and boost.

#### Arguments:

| Name        | Type     | Required | Description                   |
|-------------|----------|----------|-------------------------------|
| dateFrom    | `number` | **Yes**  | Time to start in milliseconds |
| dateTo      | `number` | **Yes**  | Time to end  in milliseconds  |
| userAddress | `string` | **Yes**  | The user address              |

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
  dailyStakeRewards: number
  dailyBoostRewards: number
}
```

| Name                | Description                 |
|---------------------|-----------------------------|
| `date`              | Current rate date           |
| `dailyRewards`      | Daily reward asset in ETH   |
| `dailyRewardsUsd`   | Daily reward asset in USD   |
| `dailyRewardsEur`   | Daily reward asset in EUR   |
| `dailyRewardsGbp`   | Daily reward asset in GBP   |
| `dailyRewardsCny`   | Daily reward asset in CNY   |
| `dailyRewardsJpy`   | Daily reward asset in JPY   |
| `dailyRewardsKrw`   | Daily reward asset in KRW   |
| `dailyRewardsAud`   | Daily reward asset in AUD   |
| `dailyStakeRewards` | Always `0`                  |
| `dailyBoostRewards` | Always `0`                  |

#### Example:

```ts
await sdk.vault.getStakerRewards({
  userAddress: '0x...',
  dateTo: 1727827200000,
  dateFrom: 1721606400000,
})
```
