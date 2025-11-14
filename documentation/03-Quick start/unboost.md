---
id: unboost-os-token
title: Unboost osToken
sidebar_position: 7
---

# Unboost osToken

The unboost process allows you to safely exit a leveraged position and reclaim your osTokens from the Boost strategy. This involves repaying borrowed assets on Aave and unlocking your collateral.

```ts
import { BrowserProvider, parseEther } from 'ethers'
import { StakeWiseSDK, Network, OsTokenPositionHealth } from '@stakewise/v3-sdk'

const eip1193Provider = window.ethereum

const browserProvider = new BrowserProvider(eip1193Provider, {
  chainId: Network.Mainnet,
  name: 'mainnet',
})

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: browserProvider,
})

type Input = {
  percent: number
  userAddress: string
  vaultAddress: string
}

type PermitParams = Parameters<typeof sdk.boost.lock>[0]['permitParams']

const unboost = async (values: Input) => {
  const { percent, userAddress, vaultAddress } = values

  try {
    const boost = await sdk.boost.getData({ userAddress, vaultAddress })

    if (!boost.shares) {
      throw new Error('You don\'t have a boost.')
    }

    if (percent > 100) {
      throw new Error('Insufficient boost balance')
    }

    if (boost.exitingPercent) {
      throw new Error(`
        You already have a position in the queue for an unboost,
        you must claim tokens before creating a new position for exit.
      `)
    }

    const hash = await sdk.boost.unlock({
      percent,
      userAddress,
      vaultAddress,
    })

    await sdk.provider.waitForTransaction(hash)

    const unboostQueue = await sdk.boost.getQueuePosition({ userAddress, vaultAddress })

    // After you have unboosted, your funds are placed in the withdrawal queue.
    console.log('unboostQueue:', unboostQueue)
  }
  catch (error) {
    console.error(error)
  }
}

unboost({
  percent: 50,
  userAddress: 'USER_ADDRESS',
  vaultAddress: 'VAULT_ADDRESS',
})
```
