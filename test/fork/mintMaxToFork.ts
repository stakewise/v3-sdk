import { getAddress, parseEther } from 'ethers'

import { userAddress } from '../constants'

import mintToFork from './mintToFork'
import depositToFork from './depositToFork'
import mockForkStake from './mockForkStake'
import type { Fork } from './useForkSdk'


const depositAssets = parseEther('1')

const mintMaxToFork = async (fork: Fork) => {
  const { sdk, snapshot } = fork
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const baseInput = { userAddress, vaultAddress }

  await depositToFork({ ...fork, input: { ...baseInput, assets: depositAssets } })
  await mockForkStake(fork)

  const shares = await sdk.osToken.getMaxMintAmount(baseInput)

  await mintToFork({ ...fork, input: { ...baseInput, shares } })
}


export default mintMaxToFork
