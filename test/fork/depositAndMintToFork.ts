import { getAddress, parseEther } from 'ethers'

import { userAddress } from '../constants'

import mintToFork from './mintToFork'
import depositToFork from './depositToFork'
import type { Fork } from './useForkSdk'


const depositAssets = parseEther('1')

const depositAndMintToFork = async (fork: Fork, shares: bigint) => {
  const vaultAddress = getAddress(fork.snapshot.vaultAddress)
  const baseInput = { userAddress, vaultAddress }

  await depositToFork({ ...fork, input: { ...baseInput, assets: depositAssets } })
  await mintToFork({ ...fork, input: { ...baseInput, shares } })
}


export default depositAndMintToFork
