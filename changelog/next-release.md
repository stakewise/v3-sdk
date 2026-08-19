## Added methods

- [sdk.osToken.enterExitQueue](https://docs.stakewise.io/sdk/api/osToken/transactions/enterexitqueue)
- [sdk.osToken.claimExitedAssets](https://docs.stakewise.io/sdk/api/osToken/transactions/claimexitedassets)

## Modified methods

### 1. [sdk.vault.getVault](https://docs.stakewise.io/sdk/api/vault/requests/getvault)

#### Add new output field:
```ts
type Output = {
  isStateUpdateRequired: boolean
}
```

Indicates whether the meta vault state is out of sync with the latest rewards nonce
