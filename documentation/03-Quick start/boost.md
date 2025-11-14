---
id: boost-os-token
title: Boost osToken
sidebar_position: 6
---

# Boost osToken

StakeWise Boost enhances staking rewards by leveraging your osTokens as collateral to borrow additional assets from Aave. The borrowed funds are then restaked, creating a compounding effect that amplifies your staking position.

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

type PermitParams = Parameters<typeof sdk.boost.lock>[0]['permitParams']

const boost = async (values: Input) => {
  const { amount, userAddress, vaultAddress } = values

  const tokenAddress = sdk.config.addresses.tokens.mintToken

  try {
    const shares = parseEther(amount)
    const osTokenContract = sdk.contracts.helpers.createErc20(tokenAddress)

    const mint = await sdk.osToken.getBalance({ userAddress, vaultAddress })
    const permitAddress = await sdk.boost.getLeverageStrategyProxy({ userAddress, vaultAddress })
    const allowance = await osTokenContract.allowance(userAddress, permitAddress)

    if (!mint.shares) {
      throw new Error('You have no tokens to boost.')
    }

    if (shares > mint.shares) {
      throw new Error('Insufficient osToken balance')
    }

    const isNeedApprove = allowance < shares

    let permitParams: PermitParams

    if (isNeedApprove) {
      const code = await sdk.provider.getCode(userAddress)
      const isMultiSig = code !== '0x'

      if (isMultiSig) {
        // Use traditional approve for multi-sig wallets
        const signer = await sdk.provider.getSigner(userAddress)
        const signedContract = osTokenContract.connect(signer)

        const { hash } = await signedContract.approve(permitAddress, shares)

        await sdk.provider.waitForTransaction(hash)
      }
      else {
        // Use gasless permit for EOAs
        const { amount, deadline, v, r, s } = await sdk.utils.getPermitSignature({
          contract: sdk.contracts.tokens.mintToken,
          spenderAddress: permitAddress,
          ownerAddress: userAddress,
        })

        permitParams = {
          vault: vaultAddress,
          deadline,
          amount,
          v,
          r,
          s,
        }
      }
    }

    const hash = await sdk.boost.lock({
      amount: shares,
      permitParams,
      vaultAddress,
      userAddress,
    })

    await sdk.provider.waitForTransaction(hash)
  }
  catch (error) {
    console.error(error)
  }
}

boost({
  amount: '1.12',
  userAddress: 'USER_ADDRESS',
  vaultAddress: 'VAULT_ADDRESS',
})
```
