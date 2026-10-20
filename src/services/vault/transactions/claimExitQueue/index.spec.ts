import { describe, expect } from 'vitest'

import {
  userAddress,
  it as baseIt,
  vaultAddress,
} from '../../../../../test'
import { vaultInvalidCase } from '../../../../../test/mocks/invalidCases'

import type { ClaimExitQueueInput } from './types'


type Input = StakeWise.ExtractInput<ClaimExitQueueInput>

const firstPosition = {
  positionTicket: '100',
  timestamp: '1700000000',
  exitQueueIndex: '7',
}

const secondPosition = {
  positionTicket: '200',
  timestamp: '1700000500',
  exitQueueIndex: '9',
}

const positions = [ firstPosition, secondPosition ]
const baseInput = { userAddress, vaultAddress }
const input = { ...baseInput, positions: [ firstPosition ] }
const firstClaim = { name: 'claimExitedAssets', args: [ 100n, 1700000000n, 7n ] }
const secondClaim = { name: 'claimExitedAssets', args: [ 200n, 1700000500n, 9n ] }
const positionWithoutIndex = { positionTicket: '200', timestamp: '1700000500' }
const positionWithoutTicket = { timestamp: '1700000500', exitQueueIndex: '9' }

const invalidCases = [
  {
    ...vaultInvalidCase,
    input: { ...input, ...vaultInvalidCase.input },
  },
  {
    name: 'empty positions',
    input: { ...baseInput, positions: [] },
    message: 'The "positions" argument is an empty array',
  },
  {
    name: 'positions not array',
    input: { ...baseInput, positions: 'positions' },
    message: 'The "positions" argument must be an array',
  },
  {
    name: 'missing exit queue index',
    input: { ...baseInput, positions: [ firstPosition, positionWithoutIndex ] },
    message: 'The "exitQueueIndex" argument must be a string',
  },
  {
    name: 'missing position ticket',
    input: { ...baseInput, positions: [ firstPosition, positionWithoutTicket ] },
    message: 'The "positionTicket" argument must be a string',
  },
]

const it = baseIt.extend('mockClaimExitQueue', ({ runner, graphql, vaultContract }) => (
  () => {
    runner.on(vaultContract, { claimExitedAssets: [ 0n, 0n, 0n ] })

    graphql.mockHarvestParams({ canHarvest: false })
  }
))

describe('claimExitQueue', () => {
  it('encode', async ({ sdk, transaction, vaultContract, mockClaimExitQueue }) => {
    mockClaimExitQueue()

    await transaction.checkEncode({
      contract: vaultContract,
      method: sdk.vault.claimExitQueue,
      calls: [ firstClaim, secondClaim ],
      input: { ...baseInput, positions },
    })
  })

  it('send', async ({ sdk, transaction, mockClaimExitQueue }) => {
    mockClaimExitQueue()

    await transaction.checkMulticallSend({ method: sdk.vault.claimExitQueue, input })
  })

  it('estimateGas', async ({ sdk, transaction, mockClaimExitQueue }) => {
    mockClaimExitQueue()

    await transaction.checkEstimateGas({ method: sdk.vault.claimExitQueue, input })
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk }) => {
    const encode = async () => sdk.vault.claimExitQueue.encode(invalidInput as Input)
    const request = encode()

    await expect(request).rejects.toThrow(message)
  })
})
