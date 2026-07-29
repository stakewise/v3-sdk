---
id: burnAndWithdraw
slug: /sdk/api/vault/transactions/burnandwithdraw
description: Use the StakeWise SDK burnAndWithdraw method to burn osToken and unstake funds from a vault in a single transaction.
---

#### Description:

Burn the osToken required to unstake and withdraw funds from a vault in a single transaction.

Pass `assets` for the default withdraw-driven mode: unstake that amount, burning the minimum osToken it requires.
Pass `shares` instead for the burn-driven mode: burn exactly that many osToken shares and unstake all the collateral that burning frees.

Provide one of `assets` or `shares`.

#### Arguments:

| Name         | Type     | Required | Description                                                       |
|--------------|----------|----------|-------------------------------------------------------------------|
| assets       | `bigint` | No       | Unstake amount (withdraw-driven mode)                             |
| shares       | `bigint` | No       | osToken shares to burn; unstakes all the collateral it frees      |
| userAddress  | `string` | **Yes**  | The user address                                                  |
| vaultAddress | `string` | **Yes**  | The address of the vault                                          |

#### Example:

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
  assets: 200n, // withdraw-driven; or pass shares: 200n to burn exactly that and unstake the equivalent
}

// Send transaction
const hash = await sdk.vault.burnAndWithdraw(params)

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })

// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.burnAndWithdraw.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.burnAndWithdraw.estimateGas(params)
```
