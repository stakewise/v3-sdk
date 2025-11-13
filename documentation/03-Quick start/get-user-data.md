---
id: get-user-data
title: Get user data
sidebar_position: 1
---

# Get user data

This example demonstrates how to retrieve comprehensive user data from a specific Vault using a user's address. The response includes:

- User's stake balance
- osToken minting position
- Active boost amount
- Unstake queue
- Unboost queue
- Current APY
- History of user actions within the Vault
- Statistical data for user analytics

```ts
import { StakeWiseSDK, Network, AllocatorActionType } from '@stakewise/v3-sdk'


const sdk = const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
})

const userActionTypes = [
  AllocatorActionType.Redeemed,
  AllocatorActionType.Migrated,
  AllocatorActionType.Deposited,
  AllocatorActionType.TransferIn,
  AllocatorActionType.VaultCreated,
  AllocatorActionType.OsTokenMinted,
  AllocatorActionType.OsTokenBurned,
  AllocatorActionType.BoostDeposited,
  AllocatorActionType.OsTokenRedeemed,
  AllocatorActionType.OsTokenLiquidated,
  AllocatorActionType.ExitedAssetsClaimed,
  AllocatorActionType.BoostExitedAssetsClaimed,
]

type Input = {
  userAddress: string
  vaultAddress: string
}

const getUserData = async (values: Input) => {
  try {
    const [
      boost,
      apy,
      osToken,
      stake,
      unboostQueuePosition,
      maxUnstakeAmount,
      exitQueuePositions,
      statsChart,
      userActions,
      rewardsTable,
     ] = await Promise.all([
      sdk.boost.getData(values),
      sdk.vault.getUserApy(values),
      sdk.osToken.getBalance(values),
      sdk.vault.getStakeBalance(values),
      sdk.boost.getQueuePosition(values),
      sdk.vault.getMaxWithdrawAmount(values),
      sdk.vault.getExitQueuePositions(values),
      sdk.vault.getUserStats({ ...values, daysCount: 30 }),
      sdk.vault.getStakerActions({ ...values, skip: 0, limit: 20, types: userActionTypes })
      sdk.vault.getUserRewards({ ...values, dateFrom: Date.now(), dateTo: Date.now() - 2_592_000_000 })
    ])

    console.log('Result:', {
      apy,
      stake,
      boost,
      osToken,
      statsChart,
      userActions,
      rewardsTable,
      exitQueuePositions,
      unboostQueuePosition,
    })
  }
  catch (error) {
    console.error(error)
  }
}

getUserData({
  userAddress: 'USER_ADDRESS',
  vaultAddress: 'VAULT_ADDRESS',
})
```
---
