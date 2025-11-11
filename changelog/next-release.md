## Removed methods

- sdk.osToken.getStats

## Added methods

- sdk.osToken.getBalance
- sdk.osToken.getMaxMintAmount
- sdk.vault.getMaxWithdrawAmount
- sdk.osToken.getBurnAmountForUnstake

### Deprecated methods
- sdk.osToken.getMaxMint
- sdk.osToken.getPosition
- sdk.vault.getMaxWithdraw
- sdk.osToken.getBurnAmount

## Modified methods

### 1. [sdk.vault.getStakeBalance](https://docs.stakewise.io/vault/requests/getstakebalance)

#### Remove output field:
```ts
type Output = {
  totalExtraEarnedAssets: string 
}
```
### 2. [sdk.boost.getData](https://docs.stakewise.io/boost/requests/getdata)

#### Remove output field:
```ts
type Output = {
  osTokenHolderMaxBoostApy: number
}
```

### 3. [sdk.vault.getVault](https://docs.stakewise.io/vault/requests/getvault)

#### Add output field:
```ts
type Output = {
  isMetaVault: boolean 
}
```
#### Remove output field:
```ts
type Output = {
  osTokenHolderMaxBoostApy: string 
}
```
