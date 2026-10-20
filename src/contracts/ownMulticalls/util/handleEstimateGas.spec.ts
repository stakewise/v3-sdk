import { describe, expect } from 'vitest'

import { it, accessDenied, setFeePercent, setFeeRecipient } from '../../../../test'

import handleEstimateGas from './handleEstimateGas'
import type { ContractAbi, MulticallRequestInput } from '../types'


const cases = [
  {
    name: 'solo call',
    params: [ setFeeRecipient ],
    names: [ 'setFeeRecipient' ],
  },
  {
    name: 'multicall',
    params: [ setFeeRecipient, setFeePercent ],
    names: [ 'setFeeRecipient', 'setFeePercent' ],
  },
]

const createHandler = (contract: ContractAbi) => ({
  contract,
  run: ({ params }: MulticallRequestInput) => handleEstimateGas({ contract, multicallParams: params }),
})

describe('handleEstimateGas', () => {

  it.for(cases)('$name', async ({ params, names }, { multicall, signedVaultContract }) => {
    await multicall.checkEstimateGas({ ...createHandler(signedVaultContract), params, names })
  })

  it.for(cases)('$name revert', async ({ params }, { runner, vaultContract, signedVaultContract }) => {
    runner.revert(vaultContract, 'setFeeRecipient', accessDenied)

    const request = createHandler(signedVaultContract).run({ params })

    await expect(request).rejects.toMatchObject({ name: 'AccessDenied', message: '[estimate gas failed]:' })
  })
})
