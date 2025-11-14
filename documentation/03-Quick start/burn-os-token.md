---
id: burn-os-token
title: Burn osToken
sidebar_position: 5
---

# Burn osToken

This example demonstrates how to burn minted osTokens while simultaneously monitoring the health of the osToken position during the process.

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
  amount: string
  userAddress: string
  vaultAddress: string
}

const burn = async (values: Input) => {
  const { amount, userAddress, vaultAddress } = values

  try {
    const shares = parseEther(amount)

    const [ vault, mint, stake ] = await Promise.all([
      sdk.vault.getVault({ vaultAddress }),
      sdk.osToken.getBalance({ userAddress, vaultAddress }),
      sdk.vault.getStakeBalance({ userAddress, vaultAddress }),
    ])

    if (!mint.shares) {
      throw new Error('You have no tokens to burn.')
    }

    if (shares > mint.shares) {
      throw new Error('Insufficient osToken balance')
    }

    const { health } = sdk.osToken.getHealthFactor({
      liqThresholdPercent: BigInt(vault.osTokenConfig.liqThresholdPercent),
      mintedAssets: mint.shares - shares,
      stakedAssets: stake.assets,
    })

    if (health !== OsTokenPositionHealth.Healthy) {
      throw new Error('Your osToken position will no longer be safe.')
    }

    const hash = await sdk.osToken.burn({
      vaultAddress,
      userAddress,
      shares,
    })

    await sdk.provider.waitForTransaction(hash)
  }
  catch (error) {
    console.error(error)
  }
}

burn({
  amount: '2.21',
  userAddress: 'USER_ADDRESS',
  vaultAddress: 'VAULT_ADDRESS',
})
```
