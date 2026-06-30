---
id: depositAndMint
slug: /sdk/api/batch/depositandmint
description: Use the StakeWise SDK batch depositAndMint method to stake assets and mint osToken in a single transaction.
---

#### Description:

Deposit (stake) and mint osToken in a single transaction

On Gnosis the deposit token (GNO) is an ERC-20, so its approval and the deposit are batched together.
On a network with a native deposit token (e.g. ETH on Mainnet) it's a single transaction.

If the wallet doesn't support batching, use the regular [sdk.vault.deposit](/sdk/api/vault/transactions/deposit) then [sdk.osToken.mint](/sdk/api/osToken/transactions/mint) instead.

#### Arguments:

| Name            | Type     | Required | Description                                                |
|-----------------|----------|----------|------------------------------------------------------------|
| assets          | `bigint` | **Yes**  | Deposit amount                                             |
| receiveShares   | `bigint` | **Yes**  | The amount of osToken to mint                              |
| userAddress     | `string` | **Yes**  | The user address                                           |
| vaultAddress    | `string` | **Yes**  | The address of the vault                                   |
| referrerAddress | `string` | **No**   | The address of the referrer                                |

#### Example:

```ts
const assets = parseEther('1')
const userAddress = '0x...'
const vaultAddress = '0x...'

// The max osToken mintable against the position once this deposit lands
const receiveShares = await sdk.osToken.getMaxMintAmount({
  userAddress,
  vaultAddress,
  additionalStakedAssets: assets,
})

const params = {
  assets,
  userAddress,
  vaultAddress,
  receiveShares,
}

// Check whether the wallet can send the batch itself (EIP-5792)
const isTxBatchSupported = await sdk.utils.checkTxBatchSupported({ userAddress })

if (isTxBatchSupported) {
  // Send the batch through the wallet
  const hash = await sdk.batch.depositAndMint(params)
}

// Or get the calls to submit yourself (e.g. using Safe)
const { calls } = await sdk.batch.depositAndMint.encode(params)
```
