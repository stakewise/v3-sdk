import { expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { userAddress } from '../constants'

import mintToFork from './mintToFork'
import depositToFork from './depositToFork'
import type { Fork } from './useForkSdk'


const depositAssets = parseEther('1')

const mintForRedeemer = async (fork: Fork, shares: bigint) => {
  const { sdk, provider, snapshot } = fork
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const baseInput = { userAddress, vaultAddress }

  await depositToFork({ ...fork, input: { ...baseInput, assets: depositAssets } })
  await mintToFork({ ...fork, input: { ...baseInput, shares } })

  const signer = await provider.getSigner(userAddress)
  const redeemerAddress = await sdk.contracts.base.osTokenRedeemer.getAddress()
  const approveTx = await sdk.contracts.tokens.mintToken.connect(signer).approve(redeemerAddress, shares)
  const approveReceipt = await approveTx.wait()

  expect(approveReceipt?.status, 'the setup approve must succeed').toBe(1)
}


export default mintForRedeemer
