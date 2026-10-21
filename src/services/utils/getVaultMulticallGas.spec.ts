import { describe, expect } from 'vitest'

import { userAddress, decodeCalls, vaultAddress, it as baseIt, checkHarvestParams } from '../../../test'
import { multicallArgs, multicallNames, multicallParams } from '../../../test/mocks/utilsMulticall'

import type { MulticallRequestInput } from '../../contracts/ownMulticalls/types'


const baseFee = 7n
const priorityFee = 3n
const expectedGas = 1_000_000n

const it = baseIt.extend('vaultCall', ({ sdk, vaultContract }) => (
  ({ params }: MulticallRequestInput) => sdk.utils.getVaultMulticallGas({
    userAddress,
    vaultAddress,
    vaultContract,
    request: { params },
  })
))

describe('getVaultMulticallGas', () => {
  it('multicall', async ({ runner, graphql, vaultContract, vaultCall }) => {
    graphql.mockHarvestParams({ canHarvest: true })
    runner.on(vaultContract, {
      updateState: [],
      setAdmin: [],
      setMetadata: [],
      setFeePercent: [],
    })
    runner.setBaseFee(baseFee)
    runner.setFeeData({ maxPriorityFeePerGas: priorityFee })

    const gas = await vaultCall({ params: multicallParams })

    const [ estimated ] = runner.estimated
    const calls = decodeCalls(vaultContract, estimated.data)
    const [ updateState, ...encodedCalls ] = calls
    const names = calls.map(({ name }) => name)
    const encodedArgs = encodedCalls.map(({ args }) => args.toArray())

    expect(gas).toBe(expectedGas)
    expect(runner.estimated).toHaveLength(1)
    expect(runner.sent).toHaveLength(0)
    expect(estimated.to).toBe(vaultAddress)
    expect(estimated.from).toBe(userAddress)
    expect(names).toEqual(multicallNames)
    checkHarvestParams(updateState.args[0])
    expect(encodedArgs).toEqual(multicallArgs)
  })
})
