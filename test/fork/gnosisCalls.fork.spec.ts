import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { Network } from '../../src/helpers/enums'
import getMaxExitShares from '../../src/services/vault/helpers/getMaxExitShares'

import { it, userAddress } from '..'
import mockGraphql from '../mockGraphql'
import vaultQuery from '../mocks/vaultQuery'
import { allocatorPosition } from '../mocks/positionData'

import useForkSdk from './useForkSdk'
import checkProbe from './checkProbe'
import { getSnapshot } from './snapshots'
import fundAccount from './fundAccount'
import { gnosisAccounts } from './accounts'
import fundVaultAdmin from './fundVaultAdmin'
import mockForkStake from './mockForkStake'
import mockForkHarvestParams from './mockForkHarvestParams'

import type { Fork } from './useForkSdk'
import type { ProbeCall } from './checkProbe'
import type { VaultQueryPayload, PositionDataQueryPayload } from '../../src/graphql/subgraph/vault'


type GnosisCase = {
  name: string
  call: ProbeCall
}

const snapshot = getSnapshot(Network.Gnosis)
const vaultAddress = getAddress(snapshot.vaultAddress)
const { harvestedVaultAddress } = gnosisAccounts

const stakerAddress = '0x458cD345B4C05e8DF39d0A07220feb4Ec19F5e6f'
const plainStakerAddress = '0x39D787fdf7384597C7208644dBb6FDa1CcA4eBdf'
const splitterOwnerAddress = '0x6Da6B1EfCCb7216078B9004535941b71EeD30b0F'
const rewardSplitterAddress = '0xcB5d7a903158e563810849b7672e064E3B8D01a3'
const splitterHolderAddress = '0x907180814C494EA77bD7c4691f2212F563E88ff5'

const splitterClaimAssets = parseEther('0.001')
const assets = parseEther('1')
const shares = parseEther('0.1')
const baseInput = { userAddress, vaultAddress }
const stakeInput = { userAddress: stakerAddress, vaultAddress }
const plainStakeInput = { userAddress: plainStakerAddress, vaultAddress }

const mockVault = (vault: Partial<VaultQueryPayload['vault']>) => mockGraphql<VaultQueryPayload>({
  name: 'Vault',
  data: { vault: { ...vaultQuery.vault, ...vault } },
})

const getAdminInput = async (fork: Fork) => {
  const adminAddress = await fundVaultAdmin(fork)

  return { userAddress: adminAddress, vaultAddress }
}

const getSplitterInput = async ({ provider }: Fork) => {
  await fundAccount(provider, splitterOwnerAddress)

  mockForkHarvestParams(snapshot, false)

  return { userAddress: splitterOwnerAddress, vaultAddress: harvestedVaultAddress }
}

const gnosisCases: GnosisCase[] = [
  {
    name: 'W9 operate',
    call: async (fork) => {
      const adminInput = await getAdminInput(fork)

      return fork.sdk.vault.operate.estimateGas({ ...adminInput, feeRecipient: userAddress })
    },
  },
  {
    name: 'W10 updateState',
    call: ({ sdk }) => sdk.vault.updateState.estimateGas(baseInput),
  },
  {
    name: 'W11 setDepositDataRoot',
    call: async (fork) => {
      const adminInput = await getAdminInput(fork)
      const depositDataRoot = `0x${'11'.repeat(32)}`

      return fork.sdk.vault.setDepositDataRoot.estimateGas({ ...adminInput, depositDataRoot })
    },
  },
  {
    name: 'W12 setDepositDataManager',
    call: async (fork) => {
      const adminInput = await getAdminInput(fork)

      return fork.sdk.vault.setDepositDataManager.estimateGas({ ...adminInput, managerAddress: userAddress })
    },
  },
  {
    name: 'W16 multicall',
    call: ({ sdk }) => {
      mockVault({
        version: '3',
        isPrivate: false,
        isBlocklist: false,
        address: vaultAddress.toLowerCase(),
      })

      return sdk.vault.multicall({
        ...plainStakeInput,
        request: {
          estimateGas: true,
          params: [ { method: 'enterExitQueue', args: [ shares, plainStakerAddress ] } ],
        },
      })
    },
  },
  {
    name: 'W25 rewardSplitter create',
    call: ({ sdk }) => sdk.rewardSplitter.create.estimateGas(baseInput),
  },
  {
    name: 'W26 updateFeeRecipients',
    call: async (fork) => {
      const splitterInput = await getSplitterInput(fork)
      const holder = { address: splitterHolderAddress, shares: parseEther('9.48') }

      return fork.sdk.rewardSplitter.updateFeeRecipients.estimateGas({
        ...splitterInput,
        oldFeeRecipients: [ holder ],
        rewardSplitterAddress,
        feeRecipients: [ holder, { address: userAddress, shares } ],
      })
    },
  },
  {
    name: 'W27 setClaimer',
    call: async (fork) => {
      const splitterInput = await getSplitterInput(fork)

      return fork.sdk.rewardSplitter.setClaimer.estimateGas({
        userAddress: splitterInput.userAddress,
        claimerAddress: userAddress,
        rewardSplitterAddress,
      })
    },
  },
  {
    name: 'W28 claimRewards',
    call: async (fork) => {
      const splitterInput = await getSplitterInput(fork)

      return fork.sdk.rewardSplitter.claimRewards.estimateGas({
        ...splitterInput,
        assets: splitterClaimAssets,
        rewardSplitterAddress,
      })
    },
  },
  {
    name: 'R1 getMaxMintAmount',
    call: async ({ sdk }) => sdk.osToken.getMaxMintAmount(stakeInput),
  },
  {
    name: 'R2 getBalance',
    call: async ({ sdk }) => sdk.osToken.getBalance(stakeInput),
  },
  {
    name: 'R4 getSharesFromAssets',
    call: async ({ sdk }) => sdk.osToken.getSharesFromAssets({ amount: assets }),
  },
  {
    name: 'R5 getAssetsFromShares',
    call: async ({ sdk }) => sdk.osToken.getAssetsFromShares({ amount: shares }),
  },
  {
    name: 'R6 getBurnAmountForUnstake',
    call: async ({ sdk }) => sdk.osToken.getBurnAmountForUnstake({ ...stakeInput, assets }),
  },
  {
    name: 'R7 getUnstakeAmountForBurn',
    call: async ({ sdk }) => sdk.osToken.getUnstakeAmountForBurn({ ...stakeInput, shares }),
  },
  {
    name: 'R8 getMaxWithdrawAmount',
    call: async ({ sdk }) => sdk.vault.getMaxWithdrawAmount({ ...stakeInput, withBurn: true }),
  },
  {
    name: 'R9 getMaxExitShares',
    call: async ({ sdk }) => getMaxExitShares({ ...sdk.vault.params, ...stakeInput, burnShares: 0n }),
  },
  {
    name: 'R10 getVaultVersion',
    call: async ({ sdk }) => sdk.vault.getVaultVersion({ vaultAddress }),
  },
  {
    name: 'R11 getPositionData',
    call: async ({ sdk }) => {
      mockGraphql<PositionDataQueryPayload>({
        name: 'PositionData',
        data: { ...allocatorPosition.positionData, leverageStrategyPositions: [] },
      })

      return sdk.vault.getPositionData(stakeInput)
    },
  },
]

describe('gnosis calls', () => {
  const fork = useForkSdk({ network: Network.Gnosis })

  it.for(gnosisCases)('$name', async ({ call }) => {
    await mockForkStake(fork, stakerAddress)

    const probed = await checkProbe(fork, call)

    expect(probed).toEqual({ outcome: 'success', cause: expect.any(String), emptyTargets: [] })
  })
})
