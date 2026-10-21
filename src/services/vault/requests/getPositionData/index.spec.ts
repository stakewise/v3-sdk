import { describe, expect, vi } from 'vitest'

import {
  wait,
  userAddress,
  subgraphUrl,
  it as baseIt,
  vaultAddress,
  checksumAddress,
  mixedCaseVaultAddress,
  lowercaseChecksumAddress,
  lowercaseMixedCaseVaultAddress,
} from '../../../../../test'
import { allocatorPosition } from '../../../../../test/mocks/positionData'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { PositionDataQueryPayload, BoostProxyApyDataQueryPayload } from '../../../../graphql/subgraph/vault'


type NullableKey = 'osToken' | 'aave' | 'osTokenHolder'

type PositionPayload = Omit<PositionDataQueryPayload, NullableKey> & {
  [Key in NullableKey]: PositionDataQueryPayload[Key] | null
}

type LeveragePosition = PositionDataQueryPayload['leverageStrategyPositions'][number]

const proxyAddress = '0xd411a10c97a640c221d92f960289c2081c2b78cc'

const leveragePosition: LeveragePosition = {
  proxy: proxyAddress,
  assets: '0',
  exitingAssets: '0',
  osTokenShares: '4000000000000000000',
  exitingOsTokenShares: '0',
  exitRequest: null,
}

const positionPayload: PositionPayload = {
  vaults: [
    {
      apy: '4',
      isOsTokenEnabled: false,
      isCollateralized: true,
      allocatorMaxBoostApy: '10',
      osTokenConfig: {
        ltvPercent: '500000000000000000',
        leverageMaxMintLtvPercent: '990000000000000000',
      },
    },
  ],
  allocators: [
    {
      assets: '10000000000000000000',
      exitingAssets: '750000000000000000',
      mintedOsTokenShares: '5000000000000000000',
    },
  ],
  osToken: { apy: '9.5', feePercent: 500 },
  aave: { borrowApy: '3', leverageMaxBorrowLtvPercent: '930000000000000000' },
  leverageStrategyPositions: [ leveragePosition ],
  osTokenHolder: { balance: '2000000000000000000' },
}

const boostPayload: BoostProxyApyDataQueryPayload = {
  allocators: [ { assets: '20000000000000000000', mintedOsTokenShares: '16000000000000000000' } ],
  aavePositions: [ { borrowedAssets: '19000000000000000000' } ],
  osTokenExitRequests: [],
}

const apyData = {
  vaultApy: 4,
  borrowApy: 3,
  osTokenApy: 9.5,
  feePercent: 500,
  ltvPercent: 500000000000000000n,
  osTokenRate: 1250000000000000000n,
  osTokenMintApy: 1,
  allocatorMaxBoostApy: 10,
  leverageMaxMintLtvPercent: 990000000000000000n,
  leverageMaxBorrowLtvPercent: 930000000000000000n,
}

const vault = {
  apyData,
  isCollateralized: true,
  isOsTokenEnabled: false,
}

const fullPosition = {
  vault,
  stakedAssets: 10000000000000000000n,
  exitingAssets: 750000000000000000n,
  mintedShares: 5000000000000000000n,
  walletShares: 2000000000000000000n,
  boostedShares: 4000000000000000000n,
  boostedAssets: 0n,
  leverageReward: 30000000000000000n,
}

const unboostedPosition = {
  ...fullPosition,
  boostedShares: 0n,
  boostedAssets: 0n,
  leverageReward: 0n,
}

const withoutBoost = [ 'PositionData' ]
const withBoost = [ 'PositionData', 'BoostProxyApyData' ]

const emptyLeveragePosition: LeveragePosition = {
  ...leveragePosition,
  assets: '0',
  osTokenShares: '0',
}

const exitingLeveragePosition: LeveragePosition = {
  ...leveragePosition,
  assets: '0',
  osTokenShares: '0',
  exitingAssets: '200000000000000000',
  exitingOsTokenShares: '1000000000000000000',
}

const positionCases = [
  {
    name: 'full position',
    overrides: {},
    operations: withBoost,
    expected: fullPosition,
  },
  {
    name: 'zero boost',
    overrides: { leverageStrategyPositions: [ emptyLeveragePosition ] },
    operations: withoutBoost,
    expected: unboostedPosition,
  },
  {
    name: 'exiting boost',
    overrides: { leverageStrategyPositions: [ exitingLeveragePosition ] },
    operations: withBoost,
    expected: {
      ...fullPosition,
      boostedShares: 1000000000000000000n,
      boostedAssets: 200000000000000000n,
    },
  },
  {
    name: 'no vault',
    overrides: { vaults: [] },
    operations: withoutBoost,
    expected: { ...fullPosition, vault: null, leverageReward: 0n },
  },
  {
    name: 'new user',
    overrides: { allocators: [], leverageStrategyPositions: [], osTokenHolder: null },
    operations: withoutBoost,
    expected: {
      vault,
      stakedAssets: 0n,
      exitingAssets: 0n,
      mintedShares: 0n,
      walletShares: 0n,
      boostedShares: 0n,
      boostedAssets: 0n,
      leverageReward: 0n,
    },
  },
]

const it = baseIt.extend('mockPositionData', ({ sdk, runner, graphql }) => (
  (overrides: Partial<PositionPayload> = {}) => {
    const mintTokenControllerContract = sdk.contracts.base.mintTokenController

    runner.on(mintTokenControllerContract, { convertToAssets: ([ shares ]) => [ shares * 5n / 4n ] })

    graphql.mock<PositionPayload>({ name: 'PositionData', data: { ...positionPayload, ...overrides } })
    graphql.mock<BoostProxyApyDataQueryPayload>({ name: 'BoostProxyApyData', data: boostPayload })
  }
))

describe('getPositionData', () => {
  it.for(positionCases)('$name', async ({ overrides, operations, expected }, { sdk, graphql, mockPositionData }) => {
    mockPositionData(overrides)

    const result = await sdk.vault.getPositionData({ userAddress, vaultAddress })

    const requestedOperations = graphql.calls.map(({ operationName }) => operationName)

    expect(result).toEqual(expected)
    expect(requestedOperations).toEqual(operations)
  })

  it('request variables', async ({ sdk, graphql, mockPositionData }) => {
    mockPositionData()

    const input = { userAddress: checksumAddress, vaultAddress: mixedCaseVaultAddress }
    const positionVariables = {
      userId: lowercaseChecksumAddress,
      userAddress: lowercaseChecksumAddress,
      vaultAddress: lowercaseMixedCaseVaultAddress,
    }
    const boostVariables = {
      vaultAddress: lowercaseMixedCaseVaultAddress,
      proxyAddress,
      exitRequestId: '',
    }

    await sdk.vault.getPositionData(input)

    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'PositionData', variables: positionVariables }),
      expect.objectContaining({ url: subgraphUrl, operationName: 'BoostProxyApyData', variables: boostVariables }),
    ])
  })

  it('invalid vault address', async ({ sdk, runner, graphql }) => {
    const { input, message } = baseInputWiringCase

    const request = sdk.vault.getPositionData(input as { userAddress: string, vaultAddress: string })

    await expect(request).rejects.toThrow(message)
    expect(graphql.calls).toHaveLength(0)
    expect(runner.calls).toHaveLength(0)
  })

  it('abort', async ({ getPositionDataFromMock }) => {
    const onSuccess = vi.fn()
    const onError = vi.fn()

    const abortedRequest = getPositionDataFromMock(allocatorPosition)
    const keptRequest = getPositionDataFromMock(allocatorPosition)

    abortedRequest.then(onSuccess, onError)
    abortedRequest.abort()

    const result = await keptRequest

    await wait()

    expect(result.stakedAssets).toBe(3710862651233533935n)
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })
})
