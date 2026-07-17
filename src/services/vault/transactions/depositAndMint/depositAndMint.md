---
id: depositAndMint
slug: /sdk/api/vault/transactions/depositandmint
description: Use the StakeWise SDK vault depositAndMint method to stake assets and mint osToken in one transaction.
---

#### Description:

Deposit (stake) and mint osToken in one transaction.

#### Arguments:

| Name            | Type     | Required | Description                   |
|-----------------|----------|----------|-------------------------------|
| assets          | `bigint` | **Yes**  | Deposit amount                |
| receiveShares   | `bigint` | **Yes**  | The amount of osToken to mint |
| userAddress     | `string` | **Yes**  | The user address              |
| vaultAddress    | `string` | **Yes**  | The address of the vault      |
| referrerAddress | `string` | **No**   | The address of the referrer   |

#### Example:

```ts
const assets = parseEther('1')

const receiveShares = await sdk.osToken.getMaxMintAmount({
  vaultAddress: '0x...',
  userAddress: '0x...',
  additionalStakedAssets: assets,
})

const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
  assets,
  receiveShares,
}

// Send transaction
const hash = await sdk.vault.depositAndMint(params)

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })

// When you sign transactions on the backend (for custodians)
const { data, to, value } = await sdk.vault.depositAndMint.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.depositAndMint.estimateGas(params)
```
