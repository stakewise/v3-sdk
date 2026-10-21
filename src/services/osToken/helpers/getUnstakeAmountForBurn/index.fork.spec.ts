import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, ltvCheckBuffer, encodeContractError } from '../../../../../test'
import { useForkSdk, mintMaxToFork, sendForkTransaction, mockForkHarvestParams } from '../../../../../test/fork'


const burnShares = parseEther('0.4')
const maxPercent = parseEther('1')

const lowLtvError = encodeContractError('LowLtv')
const userOverrides = { from: userAddress }

describe('getUnstakeAmountForBurn', () => {
  const { sdk, provider, snapshot } = useForkSdk({ setup: mintMaxToFork })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const baseInput = { userAddress, vaultAddress }

  it('burn and exit', async () => {
    mockForkHarvestParams(snapshot, false)

    const { exitQueueShares, receivedAssets } = await sdk.osToken.getUnstakeAmountForBurn({
      ...baseInput,
      shares: burnShares,
    })

    const [ burnAssets, osTokenConfig, receivedShares ] = await Promise.all([
      sdk.contracts.base.mintTokenController.convertToAssets(burnShares),
      sdk.contracts.base.mintTokenConfig.v2.getConfig(vaultAddress),
      vaultContract.convertToShares(receivedAssets),
    ])

    const exitRequest = vaultContract.enterExitQueue.estimateGas(exitQueueShares, userAddress, userOverrides)

    await expect(exitRequest, 'the exit must need the burn').rejects.toMatchObject({ data: lowLtvError })

    await sendForkTransaction({
      provider,
      contract: vaultContract,
      method: sdk.osToken.burn,
      input: { ...baseInput, shares: burnShares },
      calls: [ { name: 'burnOsToken', args: [ burnShares ] } ],
    })

    const exitGas = await vaultContract.enterExitQueue.estimateGas(exitQueueShares, userAddress, userOverrides)

    expect(receivedAssets).toBe(burnAssets * maxPercent / osTokenConfig.ltvPercent)
    expect(receivedShares - exitQueueShares).toBe(ltvCheckBuffer)
    expect(exitGas).toBeGreaterThan(0n)
  })
})
