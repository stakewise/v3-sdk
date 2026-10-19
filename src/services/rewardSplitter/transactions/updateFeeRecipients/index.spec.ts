import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import {
  userAddress,
  decodeCalls,
  subgraphUrl,
  it as baseIt,
  vaultAddress,
  accessDenied,
  adminRoleError,
  checksumAddress,
  mixedCaseVaultAddress,
  rewardSplitterAddress,
  lowercaseChecksumAddress,
  lowercaseMixedCaseVaultAddress,
} from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { UpdateFeeRecipientsInput } from './types'
import type { RewardSplittersQueryPayload } from '../../../../graphql/subgraph/rewardSplitters'


type Input = StakeWise.ExtractInput<UpdateFeeRecipientsInput>

type MockUpdateFeeRecipientsInput = {
  admin?: string
  canHarvest?: boolean
}

const increasedAddress = '0x3333333333333333333333333333333333333333'
const unchangedAddress = '0x6666666666666666666666666666666666666666'
const decreasedAddress = '0x9999999999999999999999999999999999999999'
const removedAddress = '0x1212121212121212121212121212121212121212'
const addedAddress = '0x3434343434343434343434343434343434343434'

const oldFeeRecipients = [
  { address: increasedAddress, shares: parseEther('20') },
  { address: unchangedAddress, shares: parseEther('10') },
  { address: decreasedAddress, shares: parseEther('40') },
  { address: removedAddress, shares: parseEther('35') },
]

const feeRecipients = [
  { address: addedAddress, shares: parseEther('17') },
  { address: decreasedAddress, shares: parseEther('28') },
  { address: increasedAddress, shares: parseEther('50') },
  { address: unchangedAddress, shares: parseEther('10') },
]

const input = {
  userAddress,
  vaultAddress,
  rewardSplitterAddress,
  feeRecipients,
  oldFeeRecipients,
}

const mixedCalls = [
  { name: 'increaseShares', args: [ increasedAddress, parseEther('30') ] },
  { name: 'increaseShares', args: [ addedAddress, parseEther('17') ] },
  { name: 'decreaseShares', args: [ decreasedAddress, parseEther('12') ] },
  { name: 'decreaseShares', args: [ removedAddress, parseEther('35') ] },
]

const subgraphHolders = [
  { address: increasedAddress, shares: parseEther('20') },
  { address: decreasedAddress, shares: parseEther('40') },
]

const subgraphFeeRecipients = [
  { address: increasedAddress, shares: parseEther('50') },
  { address: decreasedAddress, shares: parseEther('28') },
]

const subgraphCalls = [
  { name: 'increaseShares', args: [ increasedAddress, parseEther('30') ] },
  { name: 'decreaseShares', args: [ decreasedAddress, parseEther('12') ] },
]

const diffCases = [
  {
    name: 'encode',
    values: { feeRecipients, oldFeeRecipients },
    expected: mixedCalls,
  },
  {
    name: 'address case',
    values: {
      oldFeeRecipients: [
        { address: lowercaseChecksumAddress, shares: parseEther('10') },
        { address: mixedCaseVaultAddress, shares: parseEther('50') },
      ],
      feeRecipients: [
        { address: checksumAddress, shares: parseEther('30') },
        { address: lowercaseMixedCaseVaultAddress, shares: parseEther('35') },
      ],
    },
    expected: [
      { name: 'increaseShares', args: [ checksumAddress, parseEther('20') ] },
      { name: 'decreaseShares', args: [ mixedCaseVaultAddress, parseEther('15') ] },
    ],
  },
  {
    name: 'empty old list',
    values: {
      oldFeeRecipients: [],
      feeRecipients: [
        { address: addedAddress, shares: parseEther('30') },
        { address: removedAddress, shares: parseEther('70') },
      ],
    },
    expected: [
      { name: 'increaseShares', args: [ addedAddress, parseEther('30') ] },
      { name: 'increaseShares', args: [ removedAddress, parseEther('70') ] },
    ],
  },
]

const invalidCases = [
  baseInputWiringCase,
  {
    name: 'invalid reward splitter address',
    input: { ...input, rewardSplitterAddress: '0x123' },
    message: 'The "rewardSplitterAddress" argument must be a valid address',
  },
  {
    name: 'missing reward splitter address',
    input: {
      userAddress,
      vaultAddress,
      feeRecipients,
      oldFeeRecipients,
    },
    message: 'The "rewardSplitterAddress" argument',
  },
  {
    name: 'missing fee recipients',
    input: {
      userAddress,
      vaultAddress,
      rewardSplitterAddress,
      oldFeeRecipients,
    },
    message: 'The "feeRecipients" argument must be an array',
  },
  {
    name: 'empty fee recipients',
    input: { ...input, feeRecipients: [] },
    message: 'The "feeRecipients" argument is an empty array',
  },
  {
    name: 'invalid fee recipient address',
    input: { ...input, feeRecipients: [ feeRecipients[0], { address: '0x123', shares: 1n } ] },
    message: 'The "feeRecipients" argument must be an array of objects with "address" and "shares" keys',
  },
  {
    name: 'invalid fee recipient shares',
    input: { ...input, feeRecipients: [ feeRecipients[0], { address: addedAddress, shares: 10 } ] },
    message: 'The "feeRecipients" argument must be an array of objects with "address" and "shares" keys',
  },
  {
    name: 'invalid old fee recipients',
    input: { ...input, oldFeeRecipients: 'none' },
    message: 'The "oldFeeRecipients" argument must be an array',
  },
]

const it = baseIt.extend('mockUpdateFeeRecipients', ({ sdk, runner, graphql, vaultContract }) => (
  (values: MockUpdateFeeRecipientsInput = {}) => {
    const { admin = userAddress, canHarvest = false } = values
    const rewardSplitterContract = sdk.contracts.helpers.createRewardSplitter(rewardSplitterAddress)

    runner.on(vaultContract, { admin: [ admin ] })
    runner.on(rewardSplitterContract, {
      increaseShares: [],
      decreaseShares: [],
      updateVaultState: [],
    })

    graphql.mockHarvestParams({ canHarvest })

    return rewardSplitterContract
  }
))

describe('updateFeeRecipients', () => {
  it.for(diffCases)('$name', async ({ values, expected }, { sdk, graphql, mockUpdateFeeRecipients }) => {
    const rewardSplitterContract = mockUpdateFeeRecipients()

    const encoded = await sdk.rewardSplitter.updateFeeRecipients.encode({ ...input, ...values })
    const calls = decodeCalls(rewardSplitterContract, encoded.data)
    const decodedCalls = calls.map(({ name, args }) => ({ name, args: args.toArray() }))
    const operationNames = graphql.calls.map(({ operationName }) => operationName)

    expect(encoded.to).toBe(rewardSplitterAddress)
    expect(decodedCalls).toEqual(expected)
    expect(operationNames).toEqual([ 'HarvestParams' ])
  })

  it('subgraph fee recipients', async ({ sdk, graphql, mockUpdateFeeRecipients }) => {
    const rewardSplitterContract = mockUpdateFeeRecipients()
    const subgraphSplitter = {
      id: rewardSplitterAddress,
      owner: userAddress,
      version: '2',
      claimer: null,
      totalShares: parseEther('60').toString(),
      shareHolders: subgraphHolders.map(({ address, shares }) => ({
        id: `${rewardSplitterAddress}-${address}`,
        address,
        shares: shares.toString(),
      })),
    }
    const splittersRequest = {
      url: subgraphUrl,
      operationName: 'RewardSplitters',
      variables: {
        where: {
          vault: vaultAddress,
          id: rewardSplitterAddress,
        },
      },
    }

    graphql.mock<RewardSplittersQueryPayload>({
      name: 'RewardSplitters',
      data: { rewardSplitters: [ subgraphSplitter ] },
    })

    const encoded = await sdk.rewardSplitter.updateFeeRecipients.encode({
      ...input,
      feeRecipients: subgraphFeeRecipients,
      oldFeeRecipients: undefined,
    })
    const calls = decodeCalls(rewardSplitterContract, encoded.data)
    const decodedCalls = calls.map(({ name, args }) => ({ name, args: args.toArray() }))
    const splittersCalls = graphql.calls.filter(({ operationName }) => operationName === 'RewardSplitters')

    expect(decodedCalls).toEqual(subgraphCalls)
    expect(splittersCalls).toEqual([ expect.objectContaining(splittersRequest) ])
  })

  it('send', async ({ sdk, transaction, mockUpdateFeeRecipients }) => {
    mockUpdateFeeRecipients()

    await transaction.checkMulticallSend({ method: sdk.rewardSplitter.updateFeeRecipients, input })
  })

  it('estimateGas', async ({ sdk, transaction, mockUpdateFeeRecipients }) => {
    mockUpdateFeeRecipients()

    await transaction.checkEstimateGas({ method: sdk.rewardSplitter.updateFeeRecipients, input })
  })

  it('with harvest', async ({ sdk, transaction, mockUpdateFeeRecipients }) => {
    const rewardSplitterContract = mockUpdateFeeRecipients({ canHarvest: true })

    await transaction.checkHarvest({
      input,
      contract: rewardSplitterContract,
      method: sdk.rewardSplitter.updateFeeRecipients,
      names: [ 'updateVaultState', ...mixedCalls.map(({ name }) => name) ],
    })
  })

  it('not admin', async ({ sdk, runner, mockUpdateFeeRecipients }) => {
    const rewardSplitterContract = mockUpdateFeeRecipients({ admin: checksumAddress })

    runner.revert(rewardSplitterContract, 'increaseShares', accessDenied)

    const request = sdk.rewardSplitter.updateFeeRecipients(input)

    await expect(request).rejects.toBe(adminRoleError)
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk }) => {
    const request = sdk.rewardSplitter.updateFeeRecipients.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
