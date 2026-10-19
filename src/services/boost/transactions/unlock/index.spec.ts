import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import {
  userAddress,
  decodeCalls,
  subgraphUrl,
  it as baseIt,
  vaultAddress,
  checkHarvestParams,
} from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { UnlockInput } from './types'
import type { UnlockEncodeOutput } from './unlockEncode'
import type { LeverageStrategyDataQueryPayload } from '../../../../graphql/subgraph/boost'


type Input = StakeWise.ExtractInput<UnlockInput>

type Positions = LeverageStrategyDataQueryPayload['leverageStrategyPositions']

type MockUnlockInput = {
  canHarvest?: boolean
  positions?: Positions
}

type EncodeCase = {
  name: string
  values: Partial<Input>
  positions: Positions
  contractName: 'leverageStrategy' | 'leverageStrategyV2'
  positionPercent: bigint
  hasUpgrade: boolean
  strategyRequests: Array<Record<string, unknown>>
}

const v2Data = { version: 2, isUpgradeRequired: false }
const v1Data = { version: 1, isUpgradeRequired: false }
const upgradeData = { version: 1, isUpgradeRequired: true }

const input = {
  userAddress,
  vaultAddress,
  percent: 50,
  leverageStrategyData: v2Data,
}
const order: Array<keyof UnlockEncodeOutput> = [ 'upgradeLeverageStrategyTxData', 'unlockTxData' ]

const strategyRequest = {
  url: subgraphUrl,
  operationName: 'LeverageStrategyData',
  variables: { userAddress, vaultAddress },
}

const harvestRequest = {
  url: subgraphUrl,
  operationName: 'HarvestParams',
  variables: { address: vaultAddress },
}

const encodeCases: EncodeCase[] = [
  {
    name: 'v1 strategy',
    values: { leverageStrategyData: v1Data },
    positions: [],
    contractName: 'leverageStrategy',
    positionPercent: parseEther('0.5'),
    hasUpgrade: false,
    strategyRequests: [],
  },
  {
    name: 'fetched upgrade',
    values: { leverageStrategyData: undefined },
    positions: [ { version: '1', exitingPercent: '0' } ],
    contractName: 'leverageStrategyV2',
    positionPercent: parseEther('0.5'),
    hasUpgrade: true,
    strategyRequests: [ strategyRequest ],
  },
  {
    name: 'fractional percent',
    values: { percent: 12.5 },
    positions: [],
    contractName: 'leverageStrategyV2',
    positionPercent: parseEther('0.125'),
    hasUpgrade: false,
    strategyRequests: [],
  },
  {
    name: 'full percent',
    values: { percent: 100 },
    positions: [],
    contractName: 'leverageStrategyV2',
    positionPercent: parseEther('1'),
    hasUpgrade: false,
    strategyRequests: [],
  },
]

const sendCases = [
  { name: 'send', leverageStrategyData: v2Data },
  { name: 'send with upgrade', leverageStrategyData: upgradeData },
]

const estimateGasCases = [
  { name: 'estimateGas', leverageStrategyData: v2Data },
  { name: 'estimateGas with upgrade', leverageStrategyData: upgradeData },
]

const invalidCases = [
  baseInputWiringCase,
  {
    name: 'zero percent',
    input: { ...input, percent: 0 },
    message: 'The "percent" argument must be greater than 0',
  },
  {
    name: 'negative percent',
    input: { ...input, percent: -5 },
    message: 'The "percent" argument must be greater than 0',
  },
  {
    name: 'percent above 100',
    input: { ...input, percent: 100.5 },
    message: 'The "percent" argument must be less than or equal to 100',
  },
  {
    name: 'invalid percent',
    input: { ...input, percent: '50' },
    message: 'The "percent" argument must be a number',
  },
  {
    name: 'missing percent',
    input: { userAddress, vaultAddress, leverageStrategyData: v2Data },
    message: 'The "percent" argument',
  },
  {
    name: 'invalid strategy data',
    input: { ...input, leverageStrategyData: { version: '2', isUpgradeRequired: false } },
    message: 'The "leverageStrategyData.version" argument must be a number',
  },
]

const it = baseIt.extend('mockUnlock', ({ mockLeverageStrategy }) => (
  (values: MockUnlockInput = {}) => {
    const { canHarvest = false, positions = [] } = values

    return mockLeverageStrategy({ positions, canHarvest, answers: { enterExitQueue: [ 1n ] } })
  }
))

describe('unlock', () => {
  it.for(encodeCases)('$name', async (encodeCase, { sdk, graphql, mockUnlock }) => {
    const { values, positions, contractName, positionPercent, hasUpgrade, strategyRequests } = encodeCase

    mockUnlock({ positions })

    const leverageStrategyContract = sdk.contracts.special[contractName]
    const [ tx, address ] = await Promise.all([
      sdk.boost.unlock.encode({ ...input, ...values }),
      leverageStrategyContract.getAddress(),
    ])
    const { unlockTxData, upgradeLeverageStrategyTxData } = tx
    const [ call ] = decodeCalls(leverageStrategyContract, unlockTxData.data)
    const strategyCalls = graphql.calls.filter(({ operationName }) => operationName === strategyRequest.operationName)
    const expectedRequests = strategyRequests.map((request) => expect.objectContaining(request))
    const hasUpgradeTx = Boolean(upgradeLeverageStrategyTxData)

    expect(unlockTxData.to).toBe(address)
    expect(call.name).toBe('enterExitQueue')
    expect(call.args.toArray()).toEqual([ vaultAddress, positionPercent ])
    expect(hasUpgradeTx).toBe(hasUpgrade)
    expect(strategyCalls).toEqual(expectedRequests)
  })

  it.for(sendCases)('$name', async ({ leverageStrategyData }, { sdk, transaction, mockUnlock }) => {
    mockUnlock()

    await transaction.checkSendList({
      order,
      method: sdk.boost.unlock,
      input: { ...input, leverageStrategyData },
    })
  })

  it.for(estimateGasCases)('$name', async ({ leverageStrategyData }, { sdk, transaction, mockUnlock }) => {
    mockUnlock()

    await transaction.checkEstimateGasList({
      order,
      method: sdk.boost.unlock,
      input: { ...input, leverageStrategyData },
    })
  })

  it('with harvest', async ({ sdk, graphql, mockUnlock }) => {
    const leverageStrategyContract = mockUnlock({ canHarvest: true })

    const { unlockTxData } = await sdk.boost.unlock.encode(input)
    const calls = decodeCalls(leverageStrategyContract, unlockTxData.data)
    const callNames = calls.map(({ name }) => name)
    const [ vault, harvestParams ] = calls[0].args

    expect(callNames).toEqual([ 'updateVaultState', 'enterExitQueue' ])
    expect(vault).toBe(vaultAddress)
    checkHarvestParams(harvestParams)
    expect(graphql.calls).toContainEqual(expect.objectContaining(harvestRequest))
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk, mockUnlock }) => {
    mockUnlock()

    const request = sdk.boost.unlock.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
