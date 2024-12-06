---
id: mint
slug: /osToken/transactions/mint
---

#### Description:

Getting osToken. The amount of token you can get depends on the user's current deposit in the vault.
Use data from methods [sdk.osToken.getMaxMint](/osToken/requests/getmaxmint) and [sdk.osToken.getHealthFactor](/osToken/helpers/gethealthfactor) to block a call to mint() if the number of shares is greater than what getMaxMint returns or if the number of osToken after the transaction would make the position unhealthy

#### Arguments:

| Name            | Type     | Required | Description                 |
|-----------------|----------|----------|-----------------------------|
| shares          | `bigint` | **Yes**  | mint amount                 |
| userAddress     | `string` | **Yes**  | The user address            |
| vaultAddress    | `string` | **Yes**  | The address of the vault    |
| referrerAddress | `string` | **No**   | The address of the referrer |

#### Example:

```ts
import { OsTokenPositionHealth } from '@stakewise/v3-sdk'

const amountShares = 200n // from input mb

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

const maxMint = await sdk.osToken.getMaxMint({
  mintedAssets: osToken.minted.assets,
  stakedAssets: stake.assets,
  vaultAddress: '0x...',
  ltvPercent,
})

if (amountShares > maxMint) {
  // The value of amountShares is more than we can mint
  return
}

const newMintShares = osToken.minted.shares + amountShares
const newMintAssets = await sdk.osToken.getAssetsFromShares({
  amount: newMintShares
})

const { health } = sdk.osToken.getHealthFactor({
  liqThresholdPercent,
  stakedAssets: stake.assets,
  mintedAssets: newMintAssets,
})

if (health !== OsTokenPositionHealth.Healthy) {
  // If you do a minting with so many amountShares, your position is no longer healthy
  return
}

const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
  shares: amountShares,
}

// Send transaction
const hash = await sdk.osToken.mint(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.osToken.mint.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.osToken.mint.estimateGas(params)
```
