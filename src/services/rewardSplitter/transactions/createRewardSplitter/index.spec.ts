import { describe, expect } from 'vitest'

import {
  userAddress,
  it as baseIt,
  vaultAddress,
  accessDenied,
  adminRoleError,
  checksumAddress,
  rewardSplitterAddress,
} from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { CreateRewardSplitterInput } from './types'


type Input = StakeWise.ExtractInput<CreateRewardSplitterInput>

type MockCreateRewardSplitterInput = {
  admin?: string
}

const input = { userAddress, vaultAddress }

const it = baseIt.extend('mockCreateRewardSplitter', ({ sdk, runner, vaultContract }) => (
  (values: MockCreateRewardSplitterInput = {}) => {
    const { admin = userAddress } = values
    const { rewardSplitterFactory: rewardSplitterFactoryContract } = sdk.contracts.base

    runner.on(vaultContract, { admin: [ admin ] })
    runner.on(rewardSplitterFactoryContract, { createRewardSplitter: [ rewardSplitterAddress ] })

    return rewardSplitterFactoryContract
  }
))

describe('createRewardSplitter', () => {
  it('encode', async ({ sdk, transaction, mockCreateRewardSplitter }) => {
    const contract = mockCreateRewardSplitter()

    await transaction.checkEncode({
      input,
      contract,
      method: sdk.rewardSplitter.create,
      calls: [ { name: 'createRewardSplitter', args: [ vaultAddress ] } ],
    })
  })

  it('send', async ({ sdk, transaction, mockCreateRewardSplitter }) => {
    mockCreateRewardSplitter()

    await transaction.checkSend({ method: sdk.rewardSplitter.create, input })
  })

  it('estimateGas', async ({ sdk, transaction, mockCreateRewardSplitter }) => {
    mockCreateRewardSplitter()

    await transaction.checkEstimateGas({ method: sdk.rewardSplitter.create, input })
  })

  it('not admin', async ({ sdk, runner, mockCreateRewardSplitter }) => {
    const rewardSplitterFactoryContract = mockCreateRewardSplitter({ admin: checksumAddress })

    runner.revert(rewardSplitterFactoryContract, 'createRewardSplitter', accessDenied)

    const request = sdk.rewardSplitter.create(input)

    await expect(request).rejects.toBe(adminRoleError)
  })

  it('invalid vault address', async ({ sdk }) => {
    const { input: invalidInput, message } = baseInputWiringCase

    const request = sdk.rewardSplitter.create.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
