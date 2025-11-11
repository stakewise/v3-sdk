---
id: deposit-to-vault
title: Deposit to vault
sidebar_position: 2
---

# Deposit to vault

This guide demonstrates two different approaches for depositing into a vault:

### 1. Client-Side (Browser Wallet)

Use this method when users connect their non-custodial wallet (like MetaMask) directly in the browser.

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

const deposit = async (values: Input) => {
  const { amount, userAddress, vaultAddress } = values

  try {
    const params = {
      assets: parseEther(amount),
      vaultAddress,
      userAddress,
    }

    const hash = await sdk.vault.deposit(params)

    await sdk.provider.waitForTransaction(hash)
  }
  catch (error) {
    console.error(error)
  }
}

deposit({
  amount: '1.44', // ETH
  userAddress: 'USER_ADDRESS',
  vaultAddress: 'VAULT_ADDRESS',
})
```
---

### 2. Backend-Side (Custodial Wallet)

Use this method when you manage private keys on your backend server.

```ts
import { BrowserProvider, parseEther } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'


const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
})

type Input = {
  amount: string
  userAddress: string
  vaultAddress: string
}

const deposit = async (values: Input) => {
  const { amount, userAddress, vaultAddress } = values

  try {
    const params = {
      assets: parseEther(amount),
      vaultAddress,
      userAddress,
    }

    const tx = await sdk.vault.deposit.encode(params)
    const { hash } = await yourSigningService.sendTransaction()

    await sdk.provider.waitForTransaction(hash)
  }
  catch (error) {
    console.error(error)
  }
}

deposit({
  amount: '1.44', // ETH
  userAddress: 'USER_ADDRESS',
  vaultAddress: 'VAULT_ADDRESS',
})
```
---
