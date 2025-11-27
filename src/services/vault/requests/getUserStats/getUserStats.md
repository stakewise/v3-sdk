---
id: getUserStats
slug: /vault/requests/getuserstats
---

#### Description:

Getting the user stats collection for current vault.
With the help of this data it is possible to build a chart.

#### Arguments:

| Name         | Type     | Required | Description              |
|--------------|----------|----------|--------------------------|
| daysCount    | `number` | **Yes**  | The limit in days        |
| userAddress  | `string` | **Yes**  | The user address         | 
| vaultAddress | `string` | **Yes**  | The address of the vault | 

#### Returns:

```ts
type Stat = {
  time: number
  value: number
}

type Rewards = Stat & {
  extraData?: {
    boostRewards: number
    stakeRewards: number
    extraRewards: number
  }
}

type Output = {
  apy: Stat[]
  balance: Stat[]
  rewards: Rewards[]
}
```

| Name      | Description                                                              |
|-----------|--------------------------------------------------------------------------|
| `time`    | Date and time for each data point                                        |
| `apy`     | Current APY based on time, rewards and balance.                          |
| `rewards` | Number of assets earned by the user in current vault during the interval |
| `balance` | Total assets by the user in current vault at the moment of time          |

#### Example:

```ts
await sdk.vault.getUserStats({
  daysCount: 30,
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
