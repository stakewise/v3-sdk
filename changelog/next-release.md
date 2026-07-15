## Added methods

- [sdk.vault.depositAndMint](https://docs.stakewise.io/sdk/api/vault/transactions/depositandmint)
- [sdk.vault.burnAndWithdraw](https://docs.stakewise.io/sdk/api/vault/transactions/burnandwithdraw)
- [sdk.utils.checkTxBatchSupported](https://docs.stakewise.io/sdk/api/utils/checktxbatchsupported)

## Modified methods

### 1. [sdk.osToken.getBurnAmountForUnstake](https://docs.stakewise.io/sdk/api/osToken/helpers/getburnamountforunstake)

#### Add new input field:
```ts
type Input = {
  assets?: bigint
}
```
Omit `assets` for a full exit (all underlying tokens). Pass a target withdrawal amount to burn only what that withdrawal needs - it returns `0n` when the amount is already within the max withdraw.

### 2. [sdk.osToken.getMaxMintAmount](https://docs.stakewise.io/sdk/api/osToken/requests/getmaxmintamount)

#### Add new input field:
```ts
type Input = {
  additionalStakedAssets?: bigint
}
```
Extra staked assets to fold into the position before computing the max - e.g. a deposit being staked in the same transaction, as `sdk.vault.depositAndMint` sizes its mint.

## Documentation

- New guide: [Batch transactions](https://docs.stakewise.io/sdk/fundamentals/batch-transactions) — bundle deposit, deposit + boost, boost, and unboost into one atomic EIP-5792 transaction with `wallet_sendCalls`, with a wallet-support check and a non-batch fallback.
