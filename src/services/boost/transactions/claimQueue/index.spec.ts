import { describe, expect } from 'vitest'

import {
  userAddress,
  decodeCalls,
  subgraphUrl,
  it as baseIt,
  vaultAddress,
} from '../../../../../test'
import ContractError from '../../../../helpers/wrapErrorHandler/ContractError'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { ClaimQueueInput } from './types'
import type { LeverageStrategyDataQueryPayload } from '../../../../graphql/subgraph/boost'


type Input = StakeWise.ExtractInput<ClaimQueueInput>

type Positions = LeverageStrategyDataQueryPayload['leverageStrategyPositions']

type MockClaimQueueInput = {
  canHarvest?: boolean
  positions?: Positions
}

type EncodeCase = {
  name: string
  values: Partial<Input>
  positions: Positions
  contractName: 'leverageStrategy' | 'leverageStrategyV2'
  strategyRequests: Array<Record<string, unknown>>
}

const position = { timestamp: '22', positionTicket: '11', exitQueueIndex: '33' }
const input = {
  userAddress,
  vaultAddress,
  position,
  leverageStrategyVersion: 2,
}

const strategyRequest = {
  url: subgraphUrl,
  operationName: 'LeverageStrategyData',
  variables: { userAddress, vaultAddress },
}

const encodeCases: EncodeCase[] = [
  {
    name: 'encode',
    values: {},
    positions: [],
    contractName: 'leverageStrategyV2',
    strategyRequests: [],
  },
  {
    name: 'v1 strategy',
    values: { leverageStrategyVersion: 1 },
    positions: [],
    contractName: 'leverageStrategy',
    strategyRequests: [],
  },
  {
    name: 'fetched v2',
    values: { leverageStrategyVersion: undefined },
    positions: [ { version: '2', exitingPercent: '0' } ],
    contractName: 'leverageStrategyV2',
    strategyRequests: [ strategyRequest ],
  },
  {
    name: 'fetched v1',
    values: { leverageStrategyVersion: undefined },
    positions: [ { version: '1', exitingPercent: '5' } ],
    contractName: 'leverageStrategy',
    strategyRequests: [ strategyRequest ],
  },
]

const invalidCases = [
  baseInputWiringCase,
  {
    name: 'missing position',
    input: { userAddress, vaultAddress },
    message: 'The "position" argument',
  },
  {
    name: 'invalid position timestamp',
    input: { ...input, position: { ...position, timestamp: 22 } },
    message: 'The "position.timestamp" argument must be a string',
  },
  {
    name: 'invalid position ticket',
    input: { ...input, position: { ...position, positionTicket: 11 } },
    message: 'The "position.positionTicket" argument must be a string',
  },
  {
    name: 'invalid exit queue index',
    input: { ...input, position: { ...position, exitQueueIndex: 33 } },
    message: 'The "position.exitQueueIndex" argument must be a string',
  },
  {
    name: 'invalid strategy version type',
    input: { ...input, leverageStrategyVersion: '2' },
    message: 'The "leverageStrategyVersion" argument must be a number',
  },
  {
    name: 'unknown strategy version',
    input: { ...input, leverageStrategyVersion: 3 },
    message: 'The "leverageStrategyVersion" argument must be 1 or 2',
  },
]

const it = baseIt.extend('mockClaimQueue', ({ mockLeverageStrategy }) => (
  (values: MockClaimQueueInput = {}) => {
    const { canHarvest = false, positions = [] } = values

    return mockLeverageStrategy({ positions, canHarvest, answers: { claimExitedAssets: [] } })
  }
))

describe('claimQueue', () => {
  it.for(encodeCases)('$name', async (encodeCase, { sdk, graphql, mockClaimQueue }) => {
    const { values, positions, contractName, strategyRequests } = encodeCase

    mockClaimQueue({ positions })

    const leverageStrategyContract = sdk.contracts.special[contractName]
    const [ tx, address ] = await Promise.all([
      sdk.boost.claimQueue.encode({ ...input, ...values }),
      leverageStrategyContract.getAddress(),
    ])
    const [ call ] = decodeCalls(leverageStrategyContract, tx.data)
    const strategyCalls = graphql.calls.filter(({ operationName }) => operationName === strategyRequest.operationName)

    expect(tx.to).toBe(address)
    expect(call.name).toBe('claimExitedAssets')
    expect(call.args.toArray()).toEqual([ vaultAddress, userAddress, [ 11n, 22n, 33n ] ])
    expect(strategyCalls).toEqual(strategyRequests.map((request) => expect.objectContaining(request)))
  })

  it('send', async ({ sdk, transaction, mockClaimQueue }) => {
    mockClaimQueue()

    await transaction.checkMulticallSend({ method: sdk.boost.claimQueue, input })
  })

  it('estimateGas', async ({ sdk, transaction, mockClaimQueue }) => {
    mockClaimQueue()

    await transaction.checkEstimateGas({ method: sdk.boost.claimQueue, input })
  })

  it('with harvest', async ({ sdk, transaction, mockClaimQueue }) => {
    const leverageStrategyContract = mockClaimQueue({ canHarvest: true })

    await transaction.checkHarvest({
      input,
      contract: leverageStrategyContract,
      method: sdk.boost.claimQueue,
      names: [ 'updateVaultState', 'claimExitedAssets' ],
    })
  })

  it('wallet rejection', async ({ sdk, runner, mockClaimQueue }) => {
    mockClaimQueue()

    runner.rejectSigning()

    const request = sdk.boost.claimQueue(input)

    await expect(request).rejects.toThrow(/rejected/i)
    await expect(request).rejects.toBeInstanceOf(ContractError)
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk, mockClaimQueue }) => {
    mockClaimQueue()

    const request = sdk.boost.claimQueue.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
