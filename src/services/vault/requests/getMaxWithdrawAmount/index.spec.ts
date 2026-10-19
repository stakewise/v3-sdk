import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { userAddress, decodeCalls, subgraphUrl, it as baseIt, vaultAddress } from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'
import { allocatorsPayload, emptyAllocatorsPayload } from '../../../../../test/mocks/allocators'

import type { MaxExitSharesInput } from '../../../../../test'
import type { AllocatorsQueryPayload } from '../../../../graphql/subgraph/allocator'


type MaxWithdrawInput = MaxExitSharesInput & {
  assets?: bigint
  walletShares?: bigint
  subgraphAssets?: bigint | null
}

const vaultAssets = parseEther('11')
const dustLimit = parseEther('0.00001')
const subgraphLimit = parseEther('100')

const withoutPosition = { osTokenShares: 0n }

const it = baseIt.extend('mockMaxWithdraw', ({ sdk, runner, graphql, vaultContract, mockMaxExitShares }) => (
  (values: MaxWithdrawInput = {}) => {
    const {
      walletShares = 0n,
      assets = vaultAssets,
      subgraphAssets = subgraphLimit,
      ...position
    } = values
    const mintTokenContract = sdk.contracts.tokens.mintToken
    const [ allocator ] = allocatorsPayload.allocators

    const allocatorsData: AllocatorsQueryPayload = subgraphAssets === null
      ? emptyAllocatorsPayload
      : { allocators: [ { ...allocator, assets: String(subgraphAssets) } ] }

    mockMaxExitShares(position)
    graphql.mock<AllocatorsQueryPayload>({ name: 'Allocators', data: allocatorsData })

    runner.on(mintTokenContract, { balanceOf: [ walletShares ] })
    runner.on(vaultContract, { convertToAssets: [ assets ] })
  }
))

const resultCases = [
  {
    name: 'capped by subgraph',
    values: { ...withoutPosition, subgraphAssets: parseEther('10.5') },
    expected: parseEther('10.5'),
  },
  {
    name: 'new user',
    values: { ...withoutPosition, subgraphAssets: null },
    expected: 0n,
  },
  {
    name: 'above dust',
    values: { ...withoutPosition, assets: dustLimit + 1n },
    expected: dustLimit + 1n,
  },
  {
    name: 'at dust',
    values: { ...withoutPosition, assets: dustLimit },
    expected: 0n,
  },
  {
    name: 'subgraph dust',
    values: { ...withoutPosition, subgraphAssets: dustLimit },
    expected: 0n,
  },
  {
    name: 'no stake',
    values: { stakeShares: 0n },
    expected: 0n,
  },
]

const exitSharesCases = [
  {
    name: 'partial burn',
    values: { walletShares: parseEther('2') },
    exitShares: 5757575757575757574n,
  },
  {
    name: 'wallet above debt',
    values: { walletShares: parseEther('7') },
    exitShares: 9999999999999999997n,
  },
]

const walletCases = [
  {
    name: 'with burn',
    withBurn: true,
    expected: [ { name: 'balanceOf', args: [ userAddress ] } ],
  },
  {
    name: 'without burn',
    withBurn: false,
    expected: [],
  },
]

const invalidCases = [
  baseInputWiringCase,
  {
    name: 'invalid burn flag',
    input: { userAddress, vaultAddress, withBurn: 'yes' },
    message: 'The "withBurn" argument must be a boolean',
  },
]

describe('getMaxWithdrawAmount', () => {
  it.for(resultCases)('$name', async ({ values, expected }, { sdk, mockMaxWithdraw }) => {
    mockMaxWithdraw(values)

    const amount = await sdk.vault.getMaxWithdrawAmount({ userAddress, vaultAddress })

    expect(amount).toBe(expected)
  })

  it.for(exitSharesCases)('$name', async (exitCase, { sdk, runner, vaultContract, mockMaxWithdraw }) => {
    const { values, exitShares } = exitCase

    mockMaxWithdraw(values)

    await sdk.vault.getMaxWithdrawAmount({ userAddress, vaultAddress, withBurn: true })

    const lastCall = runner.calls[runner.calls.length - 1]
    const calls = decodeCalls(vaultContract, lastCall.data)
    const [ { name, args } ] = calls
    const exitArgs = [ ...args ]

    expect(calls).toHaveLength(1)
    expect(name).toBe('convertToAssets')
    expect(exitArgs).toEqual([ exitShares ])
  })

  it('request variables', async ({ sdk, graphql, mockMaxWithdraw }) => {
    const allocatorsRequest = {
      url: subgraphUrl,
      operationName: 'Allocators',
      variables: { vaultAddress, address: userAddress },
    }

    mockMaxWithdraw(withoutPosition)

    await sdk.vault.getMaxWithdrawAmount({ userAddress, vaultAddress })

    expect(graphql.calls).toContainEqual(expect.objectContaining(allocatorsRequest))
  })

  it.for(walletCases)('$name', async ({ withBurn, expected }, { sdk, runner, mockMaxWithdraw }) => {
    const mintTokenContract = sdk.contracts.tokens.mintToken
    const mintTokenAddress = String(mintTokenContract.target).toLowerCase()

    mockMaxWithdraw({ walletShares: parseEther('2') })

    await sdk.vault.getMaxWithdrawAmount({ userAddress, vaultAddress, withBurn })

    const walletCalls = runner.calls.filter(({ to }) => to.toLowerCase() === mintTokenAddress)
    const decodedCalls = walletCalls.map(({ data }) => decodeCalls(mintTokenContract, data))
    const requests = decodedCalls.map(([ { name, args } ]) => ({ name, args: [ ...args ] }))

    expect(requests).toEqual(expected)
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk, runner, graphql }) => {
    const request = sdk.vault.getMaxWithdrawAmount(input as { userAddress: string, vaultAddress: string })

    await expect(request).rejects.toThrow(message)
    expect(graphql.calls).toHaveLength(0)
    expect(runner.calls).toHaveLength(0)
  })
})
