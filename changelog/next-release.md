## Added methods

- [sdk.vault.getSubVaults](https://docs.stakewise.io/vault/requests/getsubvaults)

## Modified methods

### 1. [sdk.vault.getVault](https://docs.stakewise.io/vault/requests/getvault)

#### Add output field:
```ts
type Output = {
  canHarvest: boolen
  exitingAssets: string
  exitingTickets: string
  ejectingSubVault: string
  pendingMetaSubVault: string
}
```

### 2. [signSDK.vault.operate](https://docs.stakewise.io/vault/transactions/operate)

#### Add new params field to update sub-vault addresses:
```ts
type Output = {
  subVaultAddress: string
  ejectSubVaultAddress: string
  rejectMetaSubVaultAddress: string
}
```
