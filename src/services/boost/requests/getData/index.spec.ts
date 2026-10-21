import { describe, expect } from 'vitest'

import { BorrowStatus } from '../../../../helpers'

import {
  userAddress,
  subgraphUrl,
  it as baseIt,
  vaultAddress,
  osTokenRatePercent,
  mixedCaseBaseInput,
  lowercaseBaseVariables,
} from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { GetBoostDataInput } from './index'
import type { AavePositionsQueryPayload, BoostMainDataQueryPayload } from '../../../../graphql/subgraph/boost'


type Input = StakeWise.ExtractInput<GetBoostDataInput>

type MockBoostInput = {
  main: BoostMainDataQueryPayload
  aave?: AavePositionsQueryPayload
}

const proxyAddress = '0xd411a10c97a640c221d92f960289c2081c2b78cc'

const position = {
  proxy: proxyAddress,
  version: '2',
  borrowLtv: '0.924036359801119480716333064969938',
  osTokenShares: '3381883219490101019',
  exitingPercent: '0',
  boostRewardAssets: '46278841902411456',
}

const vaults = [
  {
    osTokenConfig: { ltvPercent: '900000000000000000' },
    allocatorMaxBoostApy: '11.1815533799638949',
    apy: '2.25193169922952452871052105684074',
  },
]

const allocators = [ { assets: '3711253342650703010' } ]

const mainCall = {
  url: subgraphUrl,
  operationName: 'BoostMainData',
  variables: lowercaseBaseVariables,
}

const aave = { aavePositions: [ { borrowedAssets: '19697728170051156258' } ] }

const getMain = (leverageStrategyPosition: typeof position): BoostMainDataQueryPayload => ({
  vaults,
  allocators,
  leverageStrategyPositions: [ leverageStrategyPosition ],
})

const healthyData = {
  shares: 3381883219490101019n,
  vaultApy: 2.2519316992295244,
  totalShares: 3425958307016207167n,
  borrowStatus: BorrowStatus.Healthy,
  rewardAssets: 46278841902411456n,
  maxMintShares: 3181074293700602580n,
  exitingPercent: 0,
  borrowedAssets: 19697728170051156258n,
  allocatorMaxBoostApy: 11.181553379963894,
  leverageStrategyData: { version: 2, isUpgradeRequired: false },
}

const emptyData = {
  shares: 0n,
  vaultApy: 0,
  totalShares: 0n,
  borrowStatus: BorrowStatus.Healthy,
  rewardAssets: 0n,
  maxMintShares: 0n,
  exitingPercent: 0,
  borrowedAssets: 0n,
  allocatorMaxBoostApy: 0,
  leverageStrategyData: { version: 2, isUpgradeRequired: false },
}

const it = baseIt.extend('mockBoost', ({ sdk, runner, graphql }) => (
  (values: MockBoostInput) => {
    const { main, aave: aaveData = { aavePositions: [] } } = values
    const mintTokenControllerContract = sdk.contracts.base.mintTokenController

    runner.on(mintTokenControllerContract, {
      convertToShares: ([ assets ]) => [ assets * 100n / osTokenRatePercent ],
    })

    graphql.mock<BoostMainDataQueryPayload>({ name: 'BoostMainData', data: main })
    graphql.mock<AavePositionsQueryPayload>({ name: 'AavePositions', data: aaveData })
  }
))

const resultCases = [
  {
    name: 'healthy limit',
    main: getMain({ ...position, borrowLtv: '0.938' }),
    expected: healthyData,
  },
  {
    name: 'moderate',
    main: getMain({ ...position, borrowLtv: '0.939' }),
    expected: { ...healthyData, borrowStatus: BorrowStatus.Moderate },
  },
  {
    name: 'moderate limit',
    main: getMain({ ...position, borrowLtv: '0.945' }),
    expected: { ...healthyData, borrowStatus: BorrowStatus.Moderate },
  },
  {
    name: 'risky',
    main: getMain({ ...position, borrowLtv: '0.946' }),
    expected: { ...healthyData, borrowStatus: BorrowStatus.Risky },
  },
  {
    name: 'exiting',
    main: getMain({ ...position, version: '1', exitingPercent: '250000000000000000' }),
    expected: {
      ...healthyData,
      exitingPercent: 250000000000000000,
      leverageStrategyData: { version: 1, isUpgradeRequired: false },
    },
  },
]

describe('getData', () => {
  it.for(resultCases)('$name', async ({ main, expected }, { sdk, graphql, mockBoost }) => {
    mockBoost({ main, aave })

    const result = await sdk.boost.getData(mixedCaseBaseInput)

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining(mainCall),
      expect.objectContaining({ url: subgraphUrl, operationName: 'AavePositions', variables: { proxyAddress } }),
    ])
  })

  it('new user', async ({ sdk, graphql, mockBoost }) => {
    const main = { vaults, allocators: [], leverageStrategyPositions: [] }

    mockBoost({ main })

    const result = await sdk.boost.getData(mixedCaseBaseInput)

    expect(result).toEqual({
      ...emptyData,
      vaultApy: 2.2519316992295244,
      allocatorMaxBoostApy: 11.181553379963894,
    })
    expect(graphql.calls).toEqual([ expect.objectContaining(mainCall) ])
  })

  it('unknown vault', async ({ sdk, graphql, mockBoost }) => {
    const main = { vaults: [], allocators: [], leverageStrategyPositions: [] }

    mockBoost({ main })

    const result = await sdk.boost.getData(mixedCaseBaseInput)

    expect(result).toEqual(emptyData)
    expect(graphql.calls).toEqual([ expect.objectContaining(mainCall) ])
  })

  it('gnosis', async ({ gnosisSdk, runner, graphql }) => {
    const result = await gnosisSdk.boost.getData({ vaultAddress, userAddress })

    expect(result).toEqual(emptyData)
    expect(graphql.calls).toHaveLength(0)
    expect(runner.calls).toHaveLength(0)
  })

  it('invalid vault address', async ({ sdk, runner, graphql }) => {
    const { input, message } = baseInputWiringCase

    const request = sdk.boost.getData(input as Input)

    await expect(request).rejects.toThrow(message)
    expect(graphql.calls).toHaveLength(0)
    expect(runner.calls).toHaveLength(0)
  })
})
