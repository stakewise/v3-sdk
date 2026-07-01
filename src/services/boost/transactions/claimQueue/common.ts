import { boostMulticall } from '../../../../contracts'

import getLeverageStrategyData from '../../requests/getLeverageStrategyData'

import { validate } from './validate'
import type { ClaimQueueInput } from './types'


export const commonLogic = async (values: ClaimQueueInput) => {
  const { contracts } = values

  const { position, vaultAddress, userAddress, leverageStrategyVersion } = validate(values)

  if (leverageStrategyVersion) {
    const isValidLeverageStrategyVersion = [ 1, 2 ].includes(leverageStrategyVersion as number)

    if (!isValidLeverageStrategyVersion) {
      throw new Error(`The "leverageStrategyVersion" argument must be 1 or 2`)
    }
  }

  let leverageStrategyContract = leverageStrategyVersion === 2
    ? contracts.special.leverageStrategyV2
    : contracts.special.leverageStrategy

  if (!leverageStrategyVersion) {
    const { version } = await getLeverageStrategyData(values)

    if (version === 2) {
      leverageStrategyContract = contracts.special.leverageStrategyV2
    }
  }

  const multicallArgs: Omit<Parameters<typeof boostMulticall>[0], 'request'> = {
    leverageStrategyContract,
    ...values,
  }

  const params: Parameters<typeof boostMulticall>[0]['request']['params'] = [
    {
      method: 'claimExitedAssets',
      args: [ vaultAddress, userAddress, position ],
    },
  ]

  return {
    ...multicallArgs,
    request: {
      params,
    },
  }
}
