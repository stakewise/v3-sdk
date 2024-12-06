---
id: withdraw
slug: /vault/transactions/withdraw
---

#### Description:

Withdrawal of funds from a vault

#### Arguments:

| Name         | Type     | Required | Description               |
|--------------|----------|----------|---------------------------|
| assets       | `bigint` | **Yes**  | Withdraw amount           |
| userAddress  | `string` | **Yes**  | The user address          |
| vaultAddress | `string` | **Yes**  | The address of the vault  |

#### Example:

```ts
const amountAssets = 200n // from input mb

const [
  { osTokenConfig: { ltvPercent, liqThresholdPercent } },
  stake,
] = await Promise.all([
  sdk.vault.getVault({
    vaultAddress: '0x...',
  }),
  sdk.vault.getStakeBalance({
    vaultAddress: '0x...',
    userAddress: '0x...',
  }),
])

const osToken = await sdk.osToken.getPosition({
  stakedAssets: stake.assets,
  vaultAddress: '0x...',
  userAddress: '0x...',
  liqThresholdPercent,
})

const maxWithdrawAssets = await sdk.vault.getMaxWithdraw({
  mintedAssets: osToken.minted.assets,
  stakedAssets: stake.assets,
  vaultAddress: '0x...',
  ltvPercent,
})

if (amountAssets > maxWithdrawAssets) {
  // There is a withdrawal restriction if you have an osToken.

  return
}

const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
  assets: amountAssets,
}

// Send transaction
const hash = await sdk.vault.withdraw(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.withdraw.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.withdraw.estimateGas(params)
```
