import { describe, expect } from 'vitest'

import { it, userAddress, decodeCalls } from '../../../../../test'

import type { ClaimRedeemerExitQueueInput } from './types'


type Input = StakeWise.ExtractInput<ClaimRedeemerExitQueueInput>

const positions = [
  { positionTicket: '11', exitQueueIndex: '3' },
  { positionTicket: '22', exitQueueIndex: '4' },
]

const input = { userAddress, positions }

const invalidCases = [
  {
    name: 'invalid user address',
    input: { ...input, userAddress: '0x123' },
    message: 'The "userAddress" argument must be a valid address',
  },
  {
    name: 'missing positions',
    input: { userAddress },
    message: 'The "positions" argument must be an array',
  },
  {
    name: 'empty positions',
    input: { userAddress, positions: [] },
    message: 'The "positions" argument is an empty array',
  },
  {
    name: 'invalid position ticket',
    input: { userAddress, positions: [ { positionTicket: 11, exitQueueIndex: '3' } ] },
    message: 'The "positions.0.positionTicket" argument must be a string',
  },
  {
    name: 'invalid exit queue index',
    input: { userAddress, positions: [ { positionTicket: '11', exitQueueIndex: 3 } ] },
    message: 'The "positions.0.exitQueueIndex" argument must be a string',
  },
  {
    name: 'missing position ticket',
    input: { userAddress, positions: [ { exitQueueIndex: '3' } ] },
    message: 'The "positions.0.positionTicket" argument',
  },
  {
    name: 'missing exit queue index',
    input: { userAddress, positions: [ { positionTicket: '11' } ] },
    message: 'The "positions.0.exitQueueIndex" argument',
  },
]

describe('claimRedeemerExitQueue', () => {

  it.beforeEach(({ sdk, runner }) => {
    runner.on(sdk.contracts.base.osTokenRedeemer, { claimExitedAssets: [] })
  })

  it('encode', async ({ sdk }) => {
    const redeemerContract = sdk.contracts.base.osTokenRedeemer

    const [ tx, address ] = await Promise.all([
      sdk.osToken.claimRedeemerExitQueue.encode(input),
      redeemerContract.getAddress(),
    ])
    const calls = decodeCalls(redeemerContract, tx.data)
    const callNames = calls.map(({ name }) => name)
    const callArgs = calls.map(({ args }) => args.toArray())

    expect(tx.to).toBe(address)
    expect(callNames).toEqual([ 'claimExitedAssets', 'claimExitedAssets' ])
    expect(callArgs).toEqual([ [ 11n, 3n ], [ 22n, 4n ] ])
  })

  it('send', async ({ sdk, transaction }) => {
    await transaction.checkSend({ method: sdk.osToken.claimRedeemerExitQueue, input })
  })

  it('estimateGas', async ({ sdk, transaction }) => {
    await transaction.checkEstimateGas({ method: sdk.osToken.claimRedeemerExitQueue, input })
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk }) => {
    const request = sdk.osToken.claimRedeemerExitQueue.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
