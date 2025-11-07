## Removed methods

- sdk.osToken.getStats

## Modified methods

### 1. [sdk.vault.getStakeBalance](https://sdk.stakewise.io/vault/requests/getstakebalance)

#### Remove output field:
```ts
type Output = {
  totalExtraEarnedAssets: string 
}
```
### 2. [sdk.boost.getData](https://sdk.stakewise.io/boost/requests/getdata)

#### Remove output field:
```ts
type Output = {
  osTokenHolderMaxBoostApy: number
}
```

### 3. [sdk.vault.getVault](https://sdk.stakewise.io/vault/requests/getvault)

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
