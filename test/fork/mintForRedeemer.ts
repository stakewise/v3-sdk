import { expect } from 'vitest'

import { userAddress } from '../constants'

import depositAndMintToFork from './depositAndMintToFork'
import type { Fork } from './useForkSdk'


const mintForRedeemer = async (fork: Fork, shares: bigint) => {
  const { sdk, provider } = fork

  await depositAndMintToFork(fork, shares)

  const signer = await provider.getSigner(userAddress)
  const redeemerAddress = await sdk.contracts.base.osTokenRedeemer.getAddress()
  const approveTx = await sdk.contracts.tokens.mintToken.connect(signer).approve(redeemerAddress, shares)
  const approveReceipt = await approveTx.wait()

  expect(approveReceipt?.status, 'the setup approve must succeed').toBe(1)
}


export default mintForRedeemer
