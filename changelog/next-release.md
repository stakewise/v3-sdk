# New
---

# Updates
### 1. [sdk.vault.getStakeBalance](https://sdk.stakewise.io/vault/requests/getstakebalance)

#### New output:

```ts
type Output = {
  assets: bigint
  totalEarnedAssets: bigint
}
```
| Name                | Description             |
|---------------------|-------------------------|
| `assets`            | Balance in ETH          |
| `totalEarnedAssets` | Total earned rewards    |
