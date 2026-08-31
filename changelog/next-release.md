## Added methods

- [sdk.osToken.redeemerWithdraw](https://docs.stakewise.io/sdk/api/osToken/transactions/redeemerwithdraw)
- [sdk.osToken.getRedeemerExitQueuePositions](https://docs.stakewise.io/sdk/api/osToken/requests/getredeemerexitqueuepositions)
- [sdk.osToken.claimRedeemerExitQueue](https://docs.stakewise.io/sdk/api/osToken/transactions/claimredeemerexitqueue)

## Modified methods

### 1. [sdk.vault.getVault](https://docs.stakewise.io/sdk/api/vault/requests/getvault)

#### Add new output field:
```ts
type Output = {
  isStateUpdateRequired: boolean
}
```

Indicates whether the meta vault state is out of sync with the latest rewards nonce
