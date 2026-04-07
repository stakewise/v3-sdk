## Added methods

- [sdk.vault.getSubVaults](https://docs.stakewise.io/sdk/api/vault/requests/getsubvaults)
- [sdk.vault.addSubVault](https://docs.stakewise.io/sdk/api/vault/transactions/addsubvault)
- [sdk.vault.rejectSubVault](https://docs.stakewise.io/sdk/api/vault/transactions/rejectsubvault)
- [sdk.vault.ejectSubVault](https://docs.stakewise.io/sdk/api/vault/transactions/ejectsubvault)
- [sdk.vault.updateState](https://docs.stakewise.io/sdk/api/vault/transactions/updatestate)

## Modified methods

### 1. [sdk.vault.getVault](https://docs.stakewise.io/sdk/api/vault/requests/getvault)

#### Add output field:
```ts
type Output = {
  canHarvest: boolen
  exitingAssets: string
  exitingTickets: string
  ejectingSubVault: string
  subVaultsRegistry: string
  pendingMetaSubVault: string
}
```
