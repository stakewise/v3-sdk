import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import {
  stakeAmount,
  userAddress,
  decodeCalls,
  it as baseIt,
  vaultAddress,
  mintedShares,
  ltvCheckBuffer,
} from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { BurnAndWithdrawInput } from './types'
import type { MaxExitSharesInput } from '../../../../../test'
import type { AllocatorsQueryPayload } from '../../../../graphql/subgraph/allocator'


type Input = StakeWise.ExtractInput<BurnAndWithdrawInput>

type MockBurnAndWithdrawInput = MaxExitSharesInput & {
  walletShares?: bigint
}

const assets = parseEther('4')
const sharesToBurn = parseEther('2')
const baseInput = { userAddress, vaultAddress }
const assetsInput = { ...baseInput, assets }
const sharesInput = { ...baseInput, shares: sharesToBurn }
const nothingToWithdraw = 'Nothing can be withdrawn without breaking the osToken position LTV'
const exitQueueRatio = 2n

const allocatorsPayload = (stakeShares: bigint): AllocatorsQueryPayload => ({
  allocators: [
    {
      apy: '0',
      assets: stakeShares.toString(),
      totalEarnedAssets: '0',
      totalStakeEarnedAssets: '0',
      totalBoostEarnedAssets: '0',
    },
  ],
})

const encodeCases = [
  {
    name: 'encode',
    values: {},
    input: assetsInput,
    calls: [
      { name: 'burnOsToken', args: [ 857142857142857142n ] },
      { name: 'enterExitQueue', args: [ 3636363636363636363n, userAddress ] },
    ],
  },
  {
    name: 'wallet below position',
    values: { walletShares: parseEther('1') },
    input: { ...baseInput, assets: parseEther('9') },
    calls: [
      { name: 'burnOsToken', args: [ parseEther('1') ] },
      { name: 'enterExitQueue', args: [ 4696969696969696967n, userAddress ] },
    ],
  },
  {
    name: 'no position',
    values: { osTokenShares: 0n },
    input: assetsInput,
    calls: [
      { name: 'enterExitQueue', args: [ 3636363636363636363n, userAddress ] },
    ],
  },
  {
    name: 'shares at wallet balance',
    values: { walletShares: sharesToBurn },
    input: sharesInput,
    calls: [
      { name: 'burnOsToken', args: [ sharesToBurn ] },
      { name: 'enterExitQueue', args: [ sharesToBurn * exitQueueRatio - ltvCheckBuffer, userAddress ] },
    ],
  },
]

const rejectCases = [
  {
    name: 'nothing to withdraw',
    values: { stakeShares: 0n },
    input: assetsInput,
    message: nothingToWithdraw,
  },
  {
    name: 'shares above wallet',
    values: { walletShares: parseEther('4') },
    input: { ...baseInput, shares: parseEther('5') },
    message: 'The "shares" argument must be at most 4000000000000000000',
  },
  {
    name: 'shares above position',
    values: { walletShares: parseEther('8') },
    input: { ...baseInput, shares: parseEther('7') },
    message: 'The "shares" argument must be at most 6000000000000000000',
  },
]

const invalidCases = [
  baseInputWiringCase,
  {
    name: 'assets and shares',
    input: { ...assetsInput, shares: sharesToBurn },
    message: 'Provide either the "assets" or the "shares" argument, but not both',
  },
  {
    name: 'neither assets nor shares',
    input: baseInput,
    message: 'Provide either the "assets" or the "shares" argument, but not both',
  },
  {
    name: 'string assets',
    input: { ...baseInput, assets: '4' },
    message: 'The "assets" argument must be of type bigint',
  },
  {
    name: 'string shares',
    input: { ...baseInput, shares: '2' },
    message: 'The "shares" argument must be of type bigint',
  },
]

const it = baseIt.extend('mockBurnAndWithdraw', ({ sdk, runner, graphql, vaultContract, mockMaxExitShares }) => (
  (values: MockBurnAndWithdrawInput = {}) => {
    const {
      walletShares = mintedShares,
      stakeShares = stakeAmount,
      osTokenShares = mintedShares,
      ...position
    } = values

    mockMaxExitShares({ ...position, osTokenShares, stakeShares })

    graphql.mockHarvestParams({ canHarvest: false })
    graphql.mock<AllocatorsQueryPayload>({ name: 'Allocators', data: allocatorsPayload(stakeShares) })

    runner.on(sdk.contracts.tokens.mintToken, {
      balanceOf: ([ account ]) => [ account === userAddress ? walletShares : 0n ],
    })
    runner.on(vaultContract, {
      burnOsToken: [ 0n ],
      enterExitQueue: [ 0n ],
      osTokenPositions: ([ account ]) => [ account === userAddress ? osTokenShares : 0n ],
    })
    runner.on(sdk.contracts.special.stakeCalculator, {
      calculateUnstake: ([ calculatorInput ]) => {
        const { user, vault, osTokenShares: burnShares } = calculatorInput
        const isCalledForPosition = user === userAddress && vault === vaultAddress
        const exitQueueShares = isCalledForPosition ? burnShares * exitQueueRatio : 0n

        return [ { burnOsTokenShares: burnShares, exitQueueShares, receivedAssets: 0n } ]
      },
    })
  }
))

describe('burnAndWithdraw', () => {
  it.for(encodeCases)('$name', async (encodeCase, { sdk, vaultContract, mockBurnAndWithdraw }) => {
    const { values, input, calls: expected } = encodeCase

    mockBurnAndWithdraw(values)

    const encoded = await sdk.vault.burnAndWithdraw.encode(input)
    const calls = decodeCalls(vaultContract, encoded.data)
    const actual = calls.map(({ name, args }) => ({ name, args: args.toArray() }))

    expect(encoded.to).toBe(vaultAddress)
    expect(actual).toEqual(expected)
  })

  it('send', async ({ sdk, transaction, mockBurnAndWithdraw }) => {
    mockBurnAndWithdraw()

    await transaction.checkMulticallSend({ method: sdk.vault.burnAndWithdraw, input: assetsInput })
  })

  it('estimateGas', async ({ sdk, transaction, mockBurnAndWithdraw }) => {
    mockBurnAndWithdraw()

    await transaction.checkEstimateGas({ method: sdk.vault.burnAndWithdraw, input: assetsInput })
  })

  it.for(rejectCases)('$name', async ({ values, input, message }, { sdk, mockBurnAndWithdraw }) => {
    mockBurnAndWithdraw(values)

    const request = sdk.vault.burnAndWithdraw.encode(input)

    await expect(request).rejects.toThrow(message)
  })

  it('zero shares', async ({ sdk, mockBurnAndWithdraw }) => {
    mockBurnAndWithdraw()

    const request = sdk.vault.burnAndWithdraw.encode({ ...baseInput, shares: 0n })

    await expect(request).rejects.not.toHaveProperty('code')
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk }) => {
    const request = sdk.vault.burnAndWithdraw.encode(input as Input)

    await expect(request).rejects.toThrow(message)
  })
})
