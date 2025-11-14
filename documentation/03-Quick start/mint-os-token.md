---
id: mint-os-token
title: Mint osToken
sidebar_position: 4
---

# Mint osToken

This example demonstrates the osToken minting process. Note that the user must already have a stake in your vault, as minting osTokens requires existing staked assets. You can retrieve the maximum mintable amount for a user by calling the `getMaxMint` method.

```ts
import { BrowserProvider, parseEther } from 'ethers'
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

const mint = async (values: Input) => {
  const { amount, userAddress, vaultAddress } = values

  try {
    const shares = parseEther(amount)

    const [ mint, maxMintShares ] = await Promise.all([
      sdk.osToken.getBalance({ userAddress, vaultAddress }),
      sdk.osToken.getMaxMintAmount({ userAddress, vaultAddress }),
    ])

    if (!maxMintShares) {
      throw new Error('You need to make a stake in advance to be able to mint osETH.')
    }

    if (maxMintShares < shares) {
      throw new Error('You do not have sufficient stake funds for this operation.')
    }

    const hash = await sdk.osToken.mint({
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

mint({
  amount: '2.21',
  userAddress: 'USER_ADDRESS',
  vaultAddress: 'VAULT_ADDRESS',
})
```
