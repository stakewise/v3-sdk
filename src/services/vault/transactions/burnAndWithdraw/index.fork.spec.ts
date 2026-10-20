import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import mockGraphql from '../../../../../test/mockGraphql'
import { it, userAddress, decodeCalls } from '../../../../../test'
import {
  useForkSdk,
  mintToFork,
  depositToFork,
  forkNetworkCases,
  mockForkHarvestParams,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'
import type { AllocatorsQueryPayload } from '../../../../graphql/subgraph/allocator'
import type { VaultOsTokenConfigQueryPayload } from '../../../../graphql/subgraph/vault'


const depositAssets = parseEther('1')

const withdrawCases = [
  { name: 'shares', amount: { shares: parseEther('0.4') } },
  { name: 'assets', amount: { assets: parseEther('1') } },
]

const mockSubgraph = async ({ sdk, snapshot }: Fork) => {
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })

  const [ canHarvest, osTokenConfig, stakeShares ] = await Promise.all([
    sdk.contracts.base.keeper.canHarvest(vaultAddress),
    sdk.contracts.base.mintTokenConfig.v2.getConfig(vaultAddress),
    vaultContract.getShares(userAddress),
  ])

  expect(canHarvest, 'the setup deposit must harvest the vault').toBe(false)

  const stakeAssets = await vaultContract.convertToAssets(stakeShares)
  const { ltvPercent, liqThresholdPercent } = osTokenConfig

  mockForkHarvestParams(snapshot, canHarvest)

  mockGraphql<VaultOsTokenConfigQueryPayload>({
    name: 'VaultOsTokenConfig',
    data: {
      vault: {
        osTokenConfig: {
          ltvPercent: String(ltvPercent),
          liqThresholdPercent: String(liqThresholdPercent),
        },
      },
    },
  })

  mockGraphql<AllocatorsQueryPayload>({
    name: 'Allocators',
    data: {
      allocators: [
        {
          apy: '0',
          assets: String(stakeAssets),
          totalEarnedAssets: '0',
          totalStakeEarnedAssets: '0',
          totalBoostEarnedAssets: '0',
        },
      ],
    },
  })
}

const depositAndMintMax = async (setupFork: Fork) => {
  const vaultAddress = getAddress(setupFork.snapshot.vaultAddress)
  const baseInput = { userAddress, vaultAddress }

  await depositToFork({ ...setupFork, input: { ...baseInput, assets: depositAssets } })
  await mockSubgraph(setupFork)

  const shares = await setupFork.sdk.osToken.getMaxMintAmount(baseInput)

  await mintToFork({ ...setupFork, input: { ...baseInput, shares } })
}

describe('burnAndWithdraw', () => {
  describe.for(forkNetworkCases)('$name', ({ network }) => {
    const forkSdk = useForkSdk({ network, setup: depositAndMintMax })
    const { sdk, provider, snapshot } = forkSdk
    const vaultAddress = getAddress(snapshot.vaultAddress)
    const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
    const baseInput = { userAddress, vaultAddress }

    it.for(withdrawCases)('$name', async ({ amount }) => {
      const input = { ...baseInput, ...amount }

      await mockSubgraph(forkSdk)

      const latestBlock = await provider.getBlock('latest')
      const [ positionBefore, sharesBefore ] = await Promise.all([
        vaultContract.osTokenPositions(userAddress),
        vaultContract.getShares(userAddress),
      ])

      await provider.send('evm_setNextBlockTimestamp', [ latestBlock?.timestamp ])

      const [ encoded, gas ] = await Promise.all([
        sdk.vault.burnAndWithdraw.encode(input),
        sdk.vault.burnAndWithdraw.estimateGas(input),
      ])

      const hash = await sdk.vault.burnAndWithdraw(input)

      const [ receipt, sentTx, positionAfter, sharesAfter ] = await Promise.all([
        provider.waitForTransaction(hash),
        provider.getTransaction(hash),
        vaultContract.osTokenPositions(userAddress),
        vaultContract.getShares(userAddress),
      ])

      const calls = decodeCalls(vaultContract, encoded.data)
      const callNames = calls.map(({ name }) => name)

      expect(callNames).toEqual([ 'burnOsToken', 'enterExitQueue' ])

      const [ burnCall, exitCall ] = calls
      const [ burnShares ] = burnCall.args
      const [ exitShares, receiver ] = exitCall.args

      expect(receiver).toBe(userAddress)
      expect(gas).toBeGreaterThan(0n)
      expect(sentTx?.data).toBe(encoded.data)
      expect(receipt?.status).toBe(1)
      expect(positionBefore - positionAfter).toBe(burnShares)
      expect(sharesBefore - sharesAfter).toBe(exitShares)
    })
  })
})
