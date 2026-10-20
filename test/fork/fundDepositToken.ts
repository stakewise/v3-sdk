import { expect } from 'vitest'
import { ZeroAddress } from 'ethers'

import fundAccount from './fundAccount'
import type { Fork } from './useForkSdk'


type Input = {
  assets: bigint
  userAddress: string
  spenderAddress: string
}

const gnoHolderAddress = '0x0B98057eA310F4d31F2a452B414647007d1645d9'

const fundDepositToken = async ({ sdk, provider }: Fork, input: Input) => {
  const { assets, userAddress, spenderAddress } = input
  const { depositToken } = sdk.config.addresses.tokens

  if (depositToken === ZeroAddress) {
    return
  }

  const [ holderSigner, userSigner ] = await Promise.all([
    provider.getSigner(gnoHolderAddress),
    provider.getSigner(userAddress),
    fundAccount(provider, gnoHolderAddress),
  ])

  const depositTokenContract = sdk.contracts.helpers.createErc20(depositToken)

  const transferTx = await depositTokenContract.connect(holderSigner).transfer(userAddress, assets)
  const transferReceipt = await transferTx.wait()

  const approveTx = await depositTokenContract.connect(userSigner).approve(spenderAddress, assets)
  const approveReceipt = await approveTx.wait()

  expect(transferReceipt?.status, 'the holder must transfer the deposit token').toBe(1)
  expect(approveReceipt?.status, 'the user must approve the deposit token').toBe(1)
}


export default fundDepositToken
