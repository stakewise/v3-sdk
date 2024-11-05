import type { ClaimQueueInput } from './types'
import { validateArgs } from '../../../../utils'
import { boostMulticall } from '../../../../contracts'


export const commonLogic = (values: ClaimQueueInput) => {
  const { contracts, options, position, vaultAddress, userAddress } = values

  const { timestamp, positionTicket, exitQueueIndex } = position

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.string({ timestamp, positionTicket, exitQueueIndex })

  const multicallArgs: Omit<Parameters<typeof boostMulticall>[0], 'request'> = {
    leverageStrategyContract: contracts.special.leverageStrategy,
    vaultAddress,
    userAddress,
    options,
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
