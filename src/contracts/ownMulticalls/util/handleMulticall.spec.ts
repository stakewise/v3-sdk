import { describe, expect } from 'vitest'

import { it, userAddress, decodeCalls, accessDenied, setFeePercent, setFeeRecipient } from '../../../../test'

import handleMulticall from './handleMulticall'
import type { ContractAbi, MulticallRequestInput } from '../types'


const cases = [
  {
    name: 'solo call',
    params: [ setFeeRecipient ],
    names: [ 'setFeeRecipient' ],
    expected: [ [ userAddress ] ],
  },
  {
    name: 'multicall',
    params: [ setFeeRecipient, setFeePercent ],
    names: [ 'setFeeRecipient', 'setFeePercent' ],
    expected: [ [ userAddress ], [ 500n ] ],
  },
]

const failedMessage = '[transaction call failed]:'

const createHandler = (contract: ContractAbi) => ({
  contract,
  run: ({ params }: MulticallRequestInput) => handleMulticall({ contract, multicallParams: params }),
})

describe('handleMulticall', () => {

  it.for(cases)('$name', async (sendCase, { runner, multicall, vaultContract, signedVaultContract }) => {
    const { params, names, expected } = sendCase

    await multicall.checkSend({ ...createHandler(signedVaultContract), params, names })

    const calls = decodeCalls(vaultContract, runner.sent[0].data)
    const args = calls.map((call) => call.args.toArray())

    expect(args).toEqual(expected)
  })

  it.for(cases)('$name estimate revert', async ({ params }, { runner, vaultContract, signedVaultContract }) => {
    runner.revert(vaultContract, 'setFeeRecipient', accessDenied)

    const request = createHandler(signedVaultContract).run({ params })

    await expect(request).rejects.toMatchObject({ name: 'AccessDenied', message: failedMessage })
    expect(runner.sent).toHaveLength(0)
  })

  it.for(cases)('$name send revert', async ({ params }, { runner, signedVaultContract }) => {
    runner.revertSigning(accessDenied)

    const request = createHandler(signedVaultContract).run({ params })

    await expect(request).rejects.toMatchObject({ name: 'AccessDenied', message: failedMessage })
    expect(runner.sent).toHaveLength(0)
  })
})
