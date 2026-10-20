import { expect } from 'vitest'
import { getAddress } from 'ethers'

import type { Fork } from './useForkSdk'


type Input = {
  amount: bigint
  userAddress: string
}

const approveStrategyProxy = async (fork: Fork, input: Input) => {
  const { sdk, provider, snapshot } = fork
  const { amount, userAddress } = input
  const vaultAddress = getAddress(snapshot.vaultAddress)

  const [ signer, proxyAddress ] = await Promise.all([
    provider.getSigner(userAddress),
    sdk.contracts.special.leverageStrategyV2.getStrategyProxy(vaultAddress, userAddress),
  ])

  const approveTx = await sdk.contracts.tokens.mintToken.connect(signer).approve(proxyAddress, amount)
  const approveReceipt = await approveTx.wait()

  expect(approveReceipt?.status, 'the setup approve must succeed').toBe(1)
}


export default approveStrategyProxy
