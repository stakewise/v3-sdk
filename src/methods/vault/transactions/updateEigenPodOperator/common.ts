import { validateArgs } from '../../../../utils'
import { eigenPodOwnerMulticall } from '../../../../contracts'
import type { UpdateEigenPodOperatorInput } from './types'


export const commonLogic = async (values: UpdateEigenPodOperatorInput) => {
  const { contracts, userAddress, vaultAddress, options, ownerAddress, operatorAddress } = values

  validateArgs.address({ vaultAddress, userAddress, ownerAddress, operatorAddress })

  const baseMulticall = {
    eigenPodOwnerContract: contracts.helpers.createEigenPodOwner(ownerAddress),
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof eigenPodOwnerMulticall>[0]['request']['params'] = [
    { method: 'undelegate', args: [] },
    { method: 'delegateTo', args: [
      operatorAddress,
      {
        signature: '0x',
        expiry: 0,
      },
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      ],
    },
  ]

  return {
    ...baseMulticall,
    request: {
      params,
    },
  }
}
