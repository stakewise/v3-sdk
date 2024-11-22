---
id: getStakewiseStats
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

#### Example:

```ts
await sdk.utils.getStakewiseStats()
```
