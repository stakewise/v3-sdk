import { describe, expect, vi } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { Network } from '../../src/helpers/enums'
import getMaxExitShares from '../../src/services/vault/helpers/getMaxExitShares'

import { it, userAddress } from '..'
import mockGraphql from '../mockGraphql'
import vaultQuery from '../mocks/vaultQuery'
import { allocatorPosition } from '../mocks/positionData'

import useForkSdk from './useForkSdk'
import { getSnapshot } from './snapshots'
import classifyProbe from './classifyProbe'
import fundVaultAdmin from './fundVaultAdmin'
import mockForkHarvestParams from './mockForkHarvestParams'

import type { Fork } from './useForkSdk'
import type { ProbeExpected } from './classifyProbe'
import type { AllocatorsQueryPayload } from '../../src/graphql/subgraph/allocator'
import type { BoostMainDataQueryPayload, LeverageStrategyDataQueryPayload } from '../../src/graphql/subgraph/boost'
import type {
  VaultQueryPayload,
  PositionDataQueryPayload,
  VaultOsTokenConfigQueryPayload,
} from '../../src/graphql/subgraph/vault'


type ProbeCase = {
  name: string
  call: (fork: Fork) => Promise<unknown>
  expected: ProbeExpected
}

type SendCall = [ string, Array<{ to?: string }> ]

const snapshot = getSnapshot(Network.Mainnet)
const vaultAddress = getAddress(snapshot.vaultAddress)

const lockerAddress = '0x3f294e22455ecFcE652E2CFE1610ab7bFB4e87C9'
const stakerAddress = '0x08e1D3d83d8F1b7051eACd978a0F073b7Fa22B73'
const boosterAddress = '0xf04D6930c42cb324D350ab85ec61cf65EC6EffE1'
const unboosterAddress = '0xFF2B6d2d5c205b99E2e6f607B6aFA3127B9957B6'
const metaVaultAddress = '0x03f9e15680F0164F9c1d5FBF6EAc822d6dA40F5f'
const boostVaultAddress = '0xAC0F906E433d58FA868F936E8A43230473652885'
const anvilAccountAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const redeemerUserAddress = '0xC15E66eA086c82553859A2C62DB47e5270A137Ec'
const subVaultsRegistryAddress = '0x66343A85D2b6CE97EBb09C07f8b711B27bc300B0'
const vaultRewardSplitterAddress = '0x34AcBC432CbdaaBAE388b4D1BAcB4eDB3abBeB27'
const rewardSplitterHolderAddress = '0xc2cda2413e17009fcf72b1F5C3A591c2A2787371'

const unboostTicket = {
  timestamp: '1790711291',
  positionTicket: '254814059270904541751888',
}

const assets = parseEther('1')
const shares = parseEther('0.1')
const baseInput = { userAddress, vaultAddress }
const stakeInput = { userAddress: stakerAddress, vaultAddress }
const metaVaultInput = { userAddress, vaultAddress: metaVaultAddress, subVaultAddress: vaultAddress }
const emptyPosition = { timestamp: '0', positionTicket: '0', exitQueueIndex: '0' }

const mockHarvest = async ({ sdk }: Fork, harvestVaultAddress: string) => {
  const canHarvest = await sdk.contracts.base.keeper.canHarvest(harvestVaultAddress)

  mockForkHarvestParams(snapshot, canHarvest)
}

const mockVault = (vault: Partial<VaultQueryPayload['vault']>) => mockGraphql<VaultQueryPayload>({
  name: 'Vault',
  data: { vault: { ...vaultQuery.vault, ...vault } },
})

const mockMetaVault = () => mockVault({
  address: metaVaultAddress.toLowerCase(),
  subVaultsRegistry: subVaultsRegistryAddress,
})

const mockSnapshot = async (fork: Fork) => {
  const { sdk } = fork
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })

  const [ osTokenConfig, stakeShares ] = await Promise.all([
    sdk.contracts.base.mintTokenConfig.v2.getConfig(vaultAddress),
    vaultContract.getShares(stakerAddress),
    mockHarvest(fork, vaultAddress),
  ])

  const stakeAssets = String(await vaultContract.convertToAssets(stakeShares))
  const ltvPercent = String(osTokenConfig.ltvPercent)

  mockGraphql<VaultOsTokenConfigQueryPayload>({
    name: 'VaultOsTokenConfig',
    data: {
      vault: {
        osTokenConfig: {
          ltvPercent,
          liqThresholdPercent: String(osTokenConfig.liqThresholdPercent),
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
          assets: stakeAssets,
          totalEarnedAssets: '0',
          totalStakeEarnedAssets: '0',
          totalBoostEarnedAssets: '0',
        },
      ],
    },
  })

  mockGraphql<BoostMainDataQueryPayload>({
    name: 'BoostMainData',
    data: {
      leverageStrategyPositions: [],
      allocators: [ { assets: stakeAssets } ],
      vaults: [ { apy: '0', allocatorMaxBoostApy: '0', osTokenConfig: { ltvPercent } } ],
    },
  })

  mockGraphql<LeverageStrategyDataQueryPayload>({
    name: 'LeverageStrategyData',
    data: { leverageStrategyPositions: [ { version: '2', exitingPercent: '0' } ] },
  })

  mockGraphql<PositionDataQueryPayload>({
    name: 'PositionData',
    data: { ...allocatorPosition.positionData, leverageStrategyPositions: [] },
  })
}

const getAdminInput = async (fork: Fork) => {
  const adminAddress = await fundVaultAdmin(fork)

  return { userAddress: adminAddress, vaultAddress }
}

const probeCases: ProbeCase[] = [
  {
    name: 'W1 deposit',
    call: ({ sdk }) => sdk.vault.deposit.estimateGas({ ...baseInput, assets }),
    expected: 'success',
  },
  {
    name: 'W3 depositAndMint',
    call: ({ sdk }) => sdk.vault.depositAndMint.estimateGas({ ...baseInput, assets, receiveShares: shares }),
    expected: 'success',
  },
  {
    name: 'W5 withdraw',
    call: ({ sdk }) => sdk.vault.withdraw.estimateGas({ ...stakeInput, assets }),
    expected: 'success',
  },
  {
    name: 'W6 burnAndWithdraw',
    call: ({ sdk }) => sdk.vault.burnAndWithdraw.estimateGas({ ...stakeInput, assets }),
    expected: 'success',
  },
  {
    name: 'W7 claimExitQueue',
    call: ({ sdk }) => sdk.vault.claimExitQueue.estimateGas({ ...baseInput, positions: [ emptyPosition ] }),
    expected: { error: 'ExitRequestNotProcessed' },
  },
  {
    name: 'W8 create',
    call: ({ sdk }) => sdk.vault.create.estimateGas({ userAddress }),
    expected: 'success',
  },
  {
    name: 'W9 operate',
    call: async (fork) => {
      const adminInput = await getAdminInput(fork)

      return fork.sdk.vault.operate.estimateGas({ ...adminInput, feeRecipient: userAddress })
    },
    expected: 'success',
  },
  {
    name: 'W10 updateState',
    call: ({ sdk }) => sdk.vault.updateState.estimateGas(baseInput),
    expected: 'success',
  },
  {
    name: 'W11 setDepositDataRoot',
    call: async (fork) => {
      const adminInput = await getAdminInput(fork)
      const depositDataRoot = `0x${'11'.repeat(32)}`

      return fork.sdk.vault.setDepositDataRoot.estimateGas({ ...adminInput, depositDataRoot })
    },
    expected: 'success',
  },
  {
    name: 'W12 setDepositDataManager',
    call: async (fork) => {
      const adminInput = await getAdminInput(fork)

      return fork.sdk.vault.setDepositDataManager.estimateGas({ ...adminInput, managerAddress: userAddress })
    },
    expected: 'success',
  },
  {
    name: 'W13 addSubVault',
    call: ({ sdk }) => {
      mockMetaVault()

      return sdk.vault.addSubVault.estimateGas(metaVaultInput)
    },
    expected: { error: 'AccessDenied' },
  },
  {
    name: 'W14 rejectSubVault',
    call: ({ sdk }) => {
      mockMetaVault()

      return sdk.vault.rejectSubVault.estimateGas(metaVaultInput)
    },
    expected: { error: 'AccessDenied' },
  },
  {
    name: 'W15 ejectSubVault',
    call: ({ sdk }) => {
      mockMetaVault()

      return sdk.vault.ejectSubVault.estimateGas(metaVaultInput)
    },
    expected: { error: 'AccessDenied' },
  },
  {
    name: 'W16 multicall',
    call: ({ sdk }) => {
      mockVault({
        version: '5',
        isPrivate: false,
        isBlocklist: false,
        address: vaultAddress.toLowerCase(),
      })

      return sdk.vault.multicall({
        ...stakeInput,
        request: {
          estimateGas: true,
          params: [ { method: 'enterExitQueue', args: [ shares, stakerAddress ] } ],
        },
      })
    },
    expected: 'success',
  },
  {
    name: 'W17 mint',
    call: ({ sdk }) => sdk.osToken.mint.estimateGas({ ...baseInput, shares }),
    expected: { error: 'LowLtv' },
  },
  {
    name: 'W18 burn',
    call: ({ sdk }) => sdk.osToken.burn.estimateGas({ userAddress: lockerAddress, vaultAddress, shares }),
    expected: { error: 'InvalidPosition' },
  },
  {
    name: 'W19 redeemerWithdraw',
    call: ({ sdk }) => sdk.osToken.redeemerWithdraw.estimateGas({
      shares: parseEther('0.007'),
      userAddress: redeemerUserAddress,
    }),
    expected: 'success',
  },
  {
    name: 'W20 claimRedeemerExitQueue',
    call: ({ sdk }) => sdk.osToken.claimRedeemerExitQueue.estimateGas({ userAddress, positions: [ emptyPosition ] }),
    expected: { error: 'ExitRequestNotProcessed' },
  },
  {
    name: 'W21 lock',
    call: async (fork) => {
      await mockHarvest(fork, boostVaultAddress)

      return fork.sdk.boost.lock.estimateGas({
        amount: shares,
        userAddress: lockerAddress,
        vaultAddress: boostVaultAddress,
      })
    },
    expected: 'success',
  },
  {
    name: 'W22 unlock',
    call: async (fork) => {
      await mockHarvest(fork, boostVaultAddress)

      return fork.sdk.boost.unlock.estimateGas({
        percent: 100,
        userAddress: boosterAddress,
        vaultAddress: boostVaultAddress,
      })
    },
    expected: 'success',
  },
  {
    name: 'W23 claimQueue',
    call: async (fork) => {
      const { sdk } = fork
      const boostVaultContract = sdk.contracts.helpers.createVault({ vaultAddress: boostVaultAddress })
      const exitQueueIndex = await boostVaultContract.getExitQueueIndex(unboostTicket.positionTicket)

      await mockHarvest(fork, boostVaultAddress)

      return sdk.boost.claimQueue.estimateGas({
        leverageStrategyVersion: 2,
        userAddress: unboosterAddress,
        vaultAddress: boostVaultAddress,
        position: { ...unboostTicket, exitQueueIndex: String(exitQueueIndex) },
      })
    },
    expected: 'success',
  },
  {
    name: 'W24 upgradeLeverageStrategy',
    call: ({ sdk }) => sdk.boost.upgradeLeverageStrategy.estimateGas(baseInput),
    expected: { error: 'AccessDenied' },
  },
  {
    name: 'W25 rewardSplitter create',
    call: ({ sdk }) => sdk.rewardSplitter.create.estimateGas(baseInput),
    expected: 'success',
  },
  {
    name: 'W26 updateFeeRecipients',
    call: async (fork) => {
      const adminInput = await getAdminInput(fork)
      const holder = { address: rewardSplitterHolderAddress, shares: parseEther('100') }

      return fork.sdk.rewardSplitter.updateFeeRecipients.estimateGas({
        ...adminInput,
        oldFeeRecipients: [ holder ],
        rewardSplitterAddress: vaultRewardSplitterAddress,
        feeRecipients: [ holder, { address: userAddress, shares } ],
      })
    },
    expected: 'success',
  },
  {
    name: 'W27 setClaimer',
    call: async (fork) => {
      const adminAddress = await fundVaultAdmin(fork)

      return fork.sdk.rewardSplitter.setClaimer.estimateGas({
        userAddress: adminAddress,
        claimerAddress: userAddress,
        rewardSplitterAddress: vaultRewardSplitterAddress,
      })
    },
    expected: 'success',
  },
  {
    name: 'W28 claimRewards',
    call: ({ sdk }) => sdk.rewardSplitter.claimRewards.estimateGas({
      vaultAddress,
      assets: parseEther('0.001'),
      userAddress: rewardSplitterHolderAddress,
      rewardSplitterAddress: vaultRewardSplitterAddress,
    }),
    expected: 'success',
  },
  {
    name: 'W29 distributorRewards claim',
    call: ({ sdk }) => sdk.distributorRewards.claim.estimateGas({
      userAddress,
      cumulativeAmounts: [ '1' ],
      proof: [ `0x${'00'.repeat(32)}` ],
      tokens: [ sdk.config.addresses.tokens.mintToken ],
    }),
    expected: { error: 'InvalidProof' },
  },
  {
    name: 'R1 getMaxMintAmount',
    call: async ({ sdk }) => sdk.osToken.getMaxMintAmount(stakeInput),
    expected: 'success',
  },
  {
    name: 'R2 getBalance',
    call: async ({ sdk }) => sdk.osToken.getBalance(baseInput),
    expected: 'success',
  },
  {
    name: 'R3 getRate',
    call: async ({ sdk }) => sdk.osToken.getRate(),
    expected: 'success',
  },
  {
    name: 'R4 getSharesFromAssets',
    call: async ({ sdk }) => sdk.osToken.getSharesFromAssets({ amount: assets }),
    expected: 'success',
  },
  {
    name: 'R5 getAssetsFromShares',
    call: async ({ sdk }) => sdk.osToken.getAssetsFromShares({ amount: shares }),
    expected: 'success',
  },
  {
    name: 'R6 getBurnAmountForUnstake',
    call: async ({ sdk }) => sdk.osToken.getBurnAmountForUnstake({ ...stakeInput, assets }),
    expected: 'success',
  },
  {
    name: 'R7 getUnstakeAmountForBurn',
    call: async ({ sdk }) => sdk.osToken.getUnstakeAmountForBurn({ ...baseInput, shares }),
    expected: 'success',
  },
  {
    name: 'R8 getMaxWithdrawAmount',
    call: async ({ sdk }) => sdk.vault.getMaxWithdrawAmount(stakeInput),
    expected: 'success',
  },
  {
    name: 'R9 getMaxExitShares',
    call: ({ sdk }) => getMaxExitShares({ ...sdk.vault.params, ...stakeInput, burnShares: 0n }),
    expected: 'success',
  },
  {
    name: 'R10 getVaultVersion',
    call: async ({ sdk }) => sdk.vault.getVaultVersion({ vaultAddress }),
    expected: 'success',
  },
  {
    name: 'R11 getPositionData',
    call: async ({ sdk }) => sdk.vault.getPositionData(baseInput),
    expected: 'success',
  },
  {
    name: 'R12 boost getData',
    call: async ({ sdk }) => sdk.boost.getData(stakeInput),
    expected: 'success',
  },
  {
    name: 'R13 getLeverageStrategyProxy',
    call: async ({ sdk }) => sdk.boost.getLeverageStrategyProxy(baseInput),
    expected: 'success',
  },
  {
    name: 'R14 getPermitSignature',
    call: ({ sdk }) => sdk.utils.getPermitSignature({
      spenderAddress: userAddress,
      ownerAddress: anvilAccountAddress,
      contract: sdk.contracts.tokens.mintToken,
    }),
    expected: 'success',
  },
]

const getCallTargets = (calls: SendCall[]) => {
  const targets = calls
    .filter(([ method ]) => method === 'eth_call' || method === 'eth_estimateGas')
    .map(([ , [ transaction ] ]) => String(transaction.to).toLowerCase())

  return [ ...new Set(targets) ]
}

describe('mainnet', () => {
  const fork = useForkSdk()

  it.for(probeCases)('$name', async ({ call, expected }) => {
    const { provider } = fork

    await mockSnapshot(fork)

    const send = vi.spyOn(provider, 'send')
    const result = await call(fork).then((value) => ({ value }), (error: unknown) => ({ error }))
    const targets = getCallTargets(send.mock.calls as SendCall[])

    send.mockRestore()

    const codes = await Promise.all(targets.map((target) => provider.getCode(target)))
    const emptyTargets = targets.filter((_, index) => codes[index] === '0x')

    expect(classifyProbe(result)).toEqual(expected)
    expect(emptyTargets).toEqual([])
  })
})
