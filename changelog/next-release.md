## Added methods

- [sdk.osToken.enterExitQueue](https://docs.stakewise.io/sdk/api/osToken/transactions/enterexitqueue)
- [sdk.osToken.claimRedeemerExitQueue](https://docs.stakewise.io/sdk/api/osToken/transactions/claimredeemerexitqueue)
- [sdk.osToken.getRedeemerExitQueuePositions](https://docs.stakewise.io/sdk/api/osToken/requests/getredeemerexitqueuepositions)
- [sdk.vault.getAllocatorPosition](https://docs.stakewise.io/sdk/api/vault/requests/getallocatorposition)
- [sdk.vault.getStakerPosition](https://docs.stakewise.io/sdk/api/vault/requests/getstakerposition)

## Modified methods

### 1. [sdk.vault.getVault](https://docs.stakewise.io/sdk/api/vault/requests/getvault)

#### Add new output field:
```ts
type Output = {
  isStateUpdateRequired: boolean
}
```

Indicates whether the meta vault state is out of sync with the latest rewards nonce
