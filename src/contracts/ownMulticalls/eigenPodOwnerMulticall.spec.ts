import { describe } from 'vitest'

import { userAddress, it as baseIt } from '../../../test'

import eigenPodOwnerMulticall from './eigenPodOwnerMulticall'
import type { MulticallRequestInput } from './types'


const eigenPodOwnerAddress = '0x6666666666666666666666666666666666666666'

const undelegate = { method: 'undelegate', args: [] }
const delegateTo = {
  method: 'delegateTo',
  args: [ userAddress, [ '0x', 0n ], `0x${'cc'.repeat(32)}` ],
}

const it = baseIt.extend('eigenPodOwnerCall', ({ sdk, runner }) => {
  const eigenPodOwnerContract = sdk.contracts.helpers.createEigenPodOwner(eigenPodOwnerAddress)

  runner.on(eigenPodOwnerContract, { undelegate: [] })

  const run = (request: MulticallRequestInput) => eigenPodOwnerMulticall({
    userAddress,
    request,
    options: sdk.options,
    eigenPodOwnerContract,
  })

  return { run, contract: eigenPodOwnerContract }
})

describe('eigenPodOwnerMulticall', () => {

  it('transactionData', async ({ multicall, eigenPodOwnerCall }) => {
    await multicall.checkTransactionData({
      ...eigenPodOwnerCall,
      params: [ delegateTo, undelegate ],
      names: [ 'delegateTo', 'undelegate' ],
    })
  })

  it('send', async ({ multicall, eigenPodOwnerCall }) => {
    await multicall.checkSend({ ...eigenPodOwnerCall, params: [ undelegate ], names: [ 'undelegate' ] })
  })

  it('estimateGas', async ({ multicall, eigenPodOwnerCall }) => {
    await multicall.checkEstimateGas({ ...eigenPodOwnerCall, params: [ undelegate ], names: [ 'undelegate' ] })
  })

  it('callStatic', async ({ multicall, eigenPodOwnerCall }) => {
    await multicall.checkCallStatic({ ...eigenPodOwnerCall, params: [ undelegate ], values: [ [] ] })
  })
})
