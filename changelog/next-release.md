# New

#### New output:

### 1. [sdk.vault.getVaultStats](https://sdk.stakewise.io/vault/requests/getvaultstats)

#### Add new output field:
```ts
type Output = {
  extraRewards: number // new field
  stakeRewards: number // new field
}
```

### 2. [sdk.vault.getStakeBalance](https://sdk.stakewise.io/vault/requests/getstakebalance)

#### Add new output field:
```ts
type Output = {
  totalOsTokenFeeAssets: bigint // new field
}
```
