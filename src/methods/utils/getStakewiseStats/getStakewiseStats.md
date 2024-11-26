---
id: getStakewiseStats
slug: /utils/getstakewisestats
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
