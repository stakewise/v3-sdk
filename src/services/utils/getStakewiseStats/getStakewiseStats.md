---
id: getStakewiseStats
slug: /utils/getstakewisestats
description: Use the StakeWise SDK getStakewiseStats utility to fetch protocol-wide statistics including TVL, user count, and total rewards.
---

#### Description:

TVL statistics, number of users, rewards earned

#### Returns:

```ts
type Output = {
  usersCount: number
  totalAssets: string
  totalEarnedAssets: string
}
```

| Name | Description |
|------|------------|
| `totalAssets` | The OsToken total assets |
| `totalEarnedAssets` | The total assets earned in the network |
| `usersCount` | The total number of non repeated vault allocators and osToken holders |

#### Example:

```ts
await sdk.utils.getStakewiseStats()
```
