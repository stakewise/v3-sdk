import { ZeroAddress } from 'ethers'

import type { MintInput } from './types'
import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'


export const commonLogic = (values: MintInput) => {
  const { contracts, options, vaultAddress, userAddress, referrerAddress = ZeroAddress, shares } = values

  validateArgs.bigint({ shares })
  validateArgs.address({ vaultAddress, userAddress, referrerAddress })

  const multicallArgs: Omit<Parameters<typeof vaultMulticall>[0], 'request'> = {
    vaultContract: contracts.helpers.createVault({ vaultAddress }),
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'mintOsToken',
      args: [ userAddress, shares, referrerAddress ],
    },
  ]

  return {
    ...multicallArgs,
    request: {
      params,
    },
  }
}
