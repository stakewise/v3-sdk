import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress } from '../../../../../test'
import { useForkSdk, depositAndMintToFork } from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const mintShares = parseEther('0.1')
const feeAccrualSeconds = 86_400

const mintAndWait = async (setupFork: Fork) => {
  const { provider } = setupFork

  await depositAndMintToFork(setupFork, mintShares)

  await provider.send('evm_increaseTime', [ feeAccrualSeconds ])
  await provider.send('evm_mine', [])
}

describe('getBalance', () => {
  const { sdk, snapshot } = useForkSdk({ setup: mintAndWait })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })

  it('minted position', async () => {
    const balance = await sdk.osToken.getBalance({ userAddress, vaultAddress })

    const position = await vaultContract.osTokenPositions(userAddress)
    const positionAssets = await sdk.contracts.base.mintTokenController.convertToAssets(position)

    expect(position, 'the position must grow by the osToken fee').toBeGreaterThan(mintShares)
    expect(balance).toEqual({ shares: position, assets: positionAssets })
  })
})
