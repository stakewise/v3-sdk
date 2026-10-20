import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, encodeContractError } from '../../../../test'
import { useForkSdk, mockForkStake, freezeOsTokenRate, depositAndMintToFork } from '../../../../test/fork'

import getMaxExitShares from './getMaxExitShares'

import type { Fork } from '../../../../test/fork'


const mintShares = parseEther('0.4')
const burnShares = parseEther('0.1')
const overMaxShares = 1n

const lowLtvError = encodeContractError('LowLtv')
const userOverrides = { from: userAddress }

const mintAndFreeze = async (setupFork: Fork) => {
  await depositAndMintToFork(setupFork, mintShares)
  await freezeOsTokenRate(setupFork)
}

describe('getMaxExitShares', () => {
  const fork = useForkSdk({ setup: mintAndFreeze })
  const { sdk, snapshot } = fork
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const baseInput = { ...sdk.vault.params, userAddress, vaultAddress }

  it('without burn', async () => {
    await mockForkStake(fork)

    const exitShares = await getMaxExitShares({ ...baseInput, burnShares: 0n })

    const overMaxExitShares = exitShares + overMaxShares
    const exitGas = await vaultContract.enterExitQueue.estimateGas(exitShares, userAddress, userOverrides)
    const overMaxRequest = vaultContract.enterExitQueue.estimateGas(overMaxExitShares, userAddress, userOverrides)

    expect(exitGas).toBeGreaterThan(0n)
    await expect(overMaxRequest).rejects.toMatchObject({ data: lowLtvError })
  })

  it('with burn', async () => {
    await mockForkStake(fork)

    const exitShares = await getMaxExitShares({ ...baseInput, burnShares })

    const getBurnAndExitCalls = (shares: bigint) => [
      vaultContract.interface.encodeFunctionData('burnOsToken', [ burnShares ]),
      vaultContract.interface.encodeFunctionData('enterExitQueue', [ shares, userAddress ]),
    ]

    const overMaxCalls = getBurnAndExitCalls(exitShares + overMaxShares)
    const exitGas = await vaultContract.multicall.estimateGas(getBurnAndExitCalls(exitShares), userOverrides)
    const overMaxRequest = vaultContract.multicall.estimateGas(overMaxCalls, userOverrides)

    expect(exitGas).toBeGreaterThan(0n)
    await expect(overMaxRequest).rejects.toMatchObject({ data: lowLtvError })
  })
})
