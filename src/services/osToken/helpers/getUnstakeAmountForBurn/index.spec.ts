import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'
import type { Result } from 'ethers'

import { userAddress, it as baseIt, vaultAddress, ltvCheckBuffer, checkHarvestParams } from '../../../../../test'

import type { GetUnstakeAmountForBurnInput } from './index'


type Input = StakeWise.ExtractInput<GetUnstakeAmountForBurnInput>

const burnShares = parseEther('2')
const exitShares = parseEther('5')
const receivedAssets = parseEther('5.1')
const nothingToExit = { receivedAssets: 0n, exitQueueShares: 0n }

type MockUnstakeCalculatorInput = {
  exitQueueShares: bigint
}

const it = baseIt.extend('mockUnstakeCalculator', ({ sdk, runner, graphql }) => (
  (values: MockUnstakeCalculatorInput) => {
    const { exitQueueShares } = values
    const calculatorInputs: Result[] = []

    runner.on(sdk.contracts.special.stakeCalculator, {
      calculateUnstake: ([ input ]) => {
        calculatorInputs.push(input)

        return [ { burnOsTokenShares: input.osTokenShares, exitQueueShares, receivedAssets } ]
      },
    })

    graphql.mockHarvestParams({ canHarvest: true })

    const getUnstakeAmount = (shares: bigint) => (
      sdk.osToken.getUnstakeAmountForBurn({ userAddress, vaultAddress, shares })
    )

    return { getUnstakeAmount, calculatorInputs }
  }
))

const cases = [
  {
    name: 'one wei above buffer',
    exitQueueShares: ltvCheckBuffer + 1n,
    expected: { receivedAssets, exitQueueShares: 1n },
  },
  {
    name: 'at buffer',
    exitQueueShares: ltvCheckBuffer,
    expected: nothingToExit,
  },
  {
    name: 'below buffer',
    exitQueueShares: 1n,
    expected: nothingToExit,
  },
  {
    name: 'nothing to exit',
    exitQueueShares: 0n,
    expected: nothingToExit,
  },
]

const invalidCases = [
  {
    name: 'invalid vault address',
    values: { userAddress, vaultAddress: '0x123', shares: burnShares },
    expected: 'The "vaultAddress" argument must be a valid address',
  },
  {
    name: 'invalid shares',
    values: { userAddress, vaultAddress, shares: 1 } as unknown as Input,
    expected: 'The "shares" argument must be of type bigint',
  },
]

describe('getUnstakeAmountForBurn', () => {
  it.for(cases)('$name', async ({ exitQueueShares, expected }, { mockUnstakeCalculator }) => {
    const { getUnstakeAmount } = mockUnstakeCalculator({ exitQueueShares })

    const result = await getUnstakeAmount(burnShares)

    expect(result).toEqual(expected)
  })

  it('calculator input', async ({ mockUnstakeCalculator }) => {
    const { getUnstakeAmount, calculatorInputs } = mockUnstakeCalculator({ exitQueueShares: exitShares })

    const unstake = await getUnstakeAmount(burnShares)

    const [ input ] = calculatorInputs

    expect(unstake).toEqual({ receivedAssets, exitQueueShares: exitShares - ltvCheckBuffer })
    expect(calculatorInputs).toHaveLength(1)
    expect(input.toObject()).toMatchObject({ user: userAddress, vault: vaultAddress, osTokenShares: burnShares })
    checkHarvestParams(input.harvestParams)
  })

  it.for(invalidCases)('$name', async ({ values, expected }, { sdk }) => {
    const request = sdk.osToken.getUnstakeAmountForBurn(values)

    await expect(request).rejects.toThrow(expected)
  })
})
