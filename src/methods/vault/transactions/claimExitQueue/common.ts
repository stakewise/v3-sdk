import { ClaimExitQueueInput } from './types'
import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'


export const commonLogic = async (values: ClaimExitQueueInput) => {
  const { options, contracts, positions, vaultAddress, userAddress } = values

  if (!Array.isArray(positions) || !positions.length) {
    throw new Error('Not valid or empty positions')
  }

  positions.forEach(({ positionTicket, exitQueueIndex }) => {
    validateArgs.bigint({ exitQueueIndex })
    validateArgs.string({ positionTicket })
  })

  const multicallArgs: Omit<Parameters<typeof vaultMulticall>[0], 'request'> = {
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
      args: [ exitQueueIndex, timestamp, positionTicket ],
    }
  })

  return {
    multicallArgs,
    params,
  }
}
