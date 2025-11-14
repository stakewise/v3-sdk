---
id: unstake-example
title: Unstake
sidebar_position: 3
---

# Unstake

This guide outlines the implementation approach for unstaking user deposits.

```ts
import { BrowserProvider, parseEther, formatEther } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

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
  amount: string
  userAddress: string
  vaultAddress: string
}

const unstake = async (values: Input) => {
  const { amount, userAddress, vaultAddress } = values

  try {
    const assets = parseEther(amount)

    const [ stake, maxWithdrawAssets, burnAmount ] = await Promise.all([
      sdk.vault.getStakeBalance({ userAddress, vaultAddress }),
      sdk.vault.getMaxWithdrawAmount({ userAddress, vaultAddress }),
      sdk.osToken.getBurnAmountForUnstake({ userAddress, vaultAddress }),
    ])

    if (!stake.assets) {
      throw new Error('You have no tokens to unstake.')
    }

    if (assets > maxWithdrawAssets) {
      throw new Error('You do not have enough tokens to withdraw.')
    }

    if (burnAmount) {
      const value = formatEther(burnAmount)

      console.warn(`To withdraw your tokens in full, you must first burn an ${value} osToken.`)
    }

    const hash = await sdk.vault.withdraw({
      vaultAddress,
      userAddress,
      assets,
    })

    await sdk.provider.waitForTransaction(hash)

    const positions = await sdk.vault.getExitQueuePositions({ userAddress, vaultAddress })

    // After unstaking, the withdrawal of funds will be added to the exit queue, which can be obtained using the SDK.
    console.log('positions:', positions)
  }
  catch (error) {
    console.error(error)
  }
}

unstake({
  amount: '3.33',
  userAddress: 'USER_ADDRESS',
  vaultAddress: 'VAULT_ADDRESS',
})
```
