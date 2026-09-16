---
id: getPositionData
slug: /sdk/api/vault/requests/getpositiondata
description: Use the StakeWise SDK getPositionData method to fetch the data needed to calculate a user's allocator and staker positions.
---

#### Description:

Fetches the user's position in a vault: stake, minted and boosted osToken, wallet osToken balance and the APY parameters. Pass the result as `data` to `calculateAllocatorPosition` or `calculateStakerPosition`.

#### Arguments:

| Name         | Type     | Required | Description              |
|--------------|----------|----------|--------------------------|
| userAddress  | `string` | **Yes**  | The address of the user  |
| vaultAddress | `string` | **Yes**  | The address of the vault |

#### Returns:

```ts
type Output = {
  vault: {
    apyData: {
      vaultApy: number
      borrowApy: number
      osTokenApy: number
      feePercent: number
      ltvPercent: bigint
      osTokenRate: bigint
      osTokenMintApy: number
      allocatorMaxBoostApy: number
      leverageMaxMintLtvPercent: bigint
      leverageMaxBorrowLtvPercent: bigint
    }
    isCollateralized: boolean
    isOsTokenEnabled: boolean
  } | null
  stakedAssets: bigint
  exitingAssets: bigint
  mintedShares: bigint
  walletShares: bigint
  boostedShares: bigint
  boostedAssets: bigint
  leverageReward: bigint
}
```

| Name           | Description                                                              |
|----------------|--------------------------------------------------------------------------|
| vault          | Vault, osToken and Aave APY parameters, `null` if the vault is not found |
| stakedAssets   | Assets staked by the user in the vault                                   |
| exitingAssets  | Assets of the user in the exit queue                                     |
| mintedShares   | osToken shares minted by the user                                        |
| walletShares   | osToken shares in the user's wallet                                      |
| boostedShares  | osToken shares in the user's boost position, including exiting           |
| boostedAssets  | Assets in the user's boost position, including exiting                   |
| leverageReward | Annual reward of the existing boost position in assets                   |

#### Example:

```ts
const data = await sdk.vault.getPositionData({
  userAddress: '0x...',
  vaultAddress: '0x...',
})

const { apy, totalAssets } = sdk.vault.helpers.calculateAllocatorPosition({
  data,
  boostedSharesDelta: parseEther('1'),
})
```
