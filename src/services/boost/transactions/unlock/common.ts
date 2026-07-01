import { parseEther } from 'ethers'

import { boostMulticall } from '../../../../contracts'
import { getLeverageStrategyContract, validateLeverageStrategyData } from '../../helpers'

import { validate } from './validate'
import type { UnlockInput } from './types'


export const commonLogic = async (values: UnlockInput) => {
  const { leverageStrategyData } = values

  const { percent, vaultAddress } = validate(values)

  if (percent <= 0) {
    throw new Error(`The "percent" argument must be greater than 0`)
  }
  if (percent > 100) {
    throw new Error(`The "percent" argument must be less than or equal to 100`)
  }

  if (leverageStrategyData) {
    validateLeverageStrategyData(leverageStrategyData)
  }

  const { leverageStrategyContract, isUpgradeRequired } = await getLeverageStrategyContract(values)

  const multicallArgs: Omit<Parameters<typeof boostMulticall>[0], 'request'> = {
    leverageStrategyContract,
    ...values,
  }

  const params: Parameters<typeof boostMulticall>[0]['request']['params'] = []

  params.push({
    method: 'enterExitQueue',
    args: [ vaultAddress, parseEther(String(percent / 100)) ],
  })

  return {
    ...multicallArgs,
    request: {
      params,
    },
    isUpgradeRequired,
  }
}
