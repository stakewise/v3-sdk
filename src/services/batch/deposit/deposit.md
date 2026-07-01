---
id: deposit
slug: /sdk/api/batch/deposit
description: Use the StakeWise SDK batch deposit method to stake assets into a vault in a single transaction.
---

#### Description:

Deposit (stake) into a vault in a single transaction

On Gnosis the deposit token (GNO) is an ERC-20, so its approval and the deposit are batched together.
On a network with a native deposit token (e.g. ETH on Mainnet) it's a single transaction.

If the wallet doesn't support batching, use the regular [sdk.vault.deposit](/sdk/api/vault/transactions/deposit) instead.

#### Arguments:

| Name            | Type     | Required | Description                  |
|-----------------|----------|----------|------------------------------|
| assets          | `bigint` | **Yes**  | Deposit amount               |
| userAddress     | `string` | **Yes**  | The user address             |
| vaultAddress    | `string` | **Yes**  | The address of the vault     |
| referrerAddress | `string` | **No**   | The address of the referrer  |

#### Example:

```ts
const params = {
  assets: parseEther('1'),
  userAddress: '0x...',
  vaultAddress: '0x...',
}

// Check whether the wallet can send the batch itself (EIP-5792)
const isTxBatchSupported = await sdk.utils.checkTxBatchSupported({ userAddress: '0x...' })

if (isTxBatchSupported) {
  // Send the batch through the wallet
  const hash = await sdk.batch.deposit(params)
}

// Or get the calls to submit yourself (e.g. using Safe)
const { calls } = await sdk.batch.deposit.encode(params)
```
