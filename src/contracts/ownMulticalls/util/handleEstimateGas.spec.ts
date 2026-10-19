import { describe, expect } from 'vitest'

import { it, accessDenied, setFeePercent, setFeeRecipient } from '../../../../test'

import handleEstimateGas from './handleEstimateGas'
import type { ContractAbi, MulticallRequestInput } from '../types'


const soloParams = [ setFeeRecipient ]
const multiParams = [ setFeeRecipient, setFeePercent ]

const cases = [
  {
    name: 'solo call',
    params: soloParams,
    names: [ 'setFeeRecipient' ],
  },
  {
    name: 'multicall',
    params: multiParams,
    names: [ 'setFeeRecipient', 'setFeePercent' ],
  },
]

const revertCases = [
  { name: 'solo revert', params: soloParams },
  { name: 'multi revert', params: multiParams },
]

const createHandler = (contract: ContractAbi) => ({
  contract,
  run: ({ params }: MulticallRequestInput) => handleEstimateGas({ contract, multicallParams: params }),
})

describe('handleEstimateGas', () => {

  it.for(cases)('$name', async ({ params, names }, { multicall, signedVaultContract }) => {
    await multicall.checkEstimateGas({ ...createHandler(signedVaultContract), params, names })
  })

  it.for(revertCases)('$name', async ({ params }, { runner, vaultContract, signedVaultContract }) => {
    runner.revert(vaultContract, 'setFeeRecipient', accessDenied)

    const request = createHandler(signedVaultContract).run({ params })

    await expect(request).rejects.toMatchObject({ name: 'AccessDenied', message: '[estimate gas failed]:' })
  })
})
