import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'
import type { VaultMulticallBaseInput } from '../../../../contracts'
import type { ClaimExitQueueInput } from './types'


const validatePositions = (positions: ClaimExitQueueInput['positions']) => {
  validateArgs.array({ positions })

  positions.forEach(({ positionTicket, exitQueueIndex }) => {
    validateArgs.string({ exitQueueIndex, positionTicket })
  })
}

export const commonLogic = (values: ClaimExitQueueInput) => {
  const { options, contracts, positions, vaultAddress, userAddress } = values

  validatePositions(positions)

  const baseMulticallArgs: VaultMulticallBaseInput = {
    vaultContract: contracts.helpers.createVault({ vaultAddress }),
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
