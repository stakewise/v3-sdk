---
id: getSwiseUsdPrice
---

#### Description:

Current price of SWISE token to USD.

#### Returns:

```ts
type Output = string
```

#### Example:

```ts
await sdk.utils.getSwiseUsdPrice()
```
---
### `getStakewiseStats`

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
