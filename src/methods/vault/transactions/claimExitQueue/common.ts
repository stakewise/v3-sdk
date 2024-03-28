import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'
import type { ClaimExitQueueInput } from './types'


const validatePositions = (positions: ClaimExitQueueInput['positions']) => {
  validateArgs.array({ positions })

  positions.forEach(({ positionTicket, exitQueueIndex }) => {
    validateArgs.bigint({ exitQueueIndex })
    validateArgs.string({ positionTicket })
  })
}

export const commonLogic = (values: ClaimExitQueueInput) => {
  const { options, contracts, positions, vaultAddress, userAddress } = values

  validatePositions(positions)

  const baseMulticallArgs = {
    vaultContract: contracts.helpers.createVault(vaultAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = positions.map((position) => {
    const { positionTicket, exitQueueIndex, timestamp } = position

    return {
      method: 'claimExitedAssets',
      args: [ positionTicket, timestamp, exitQueueIndex ],
    }
  })

  return {
    ...baseMulticallArgs,
    request: {
      params,
    },
  }
}
