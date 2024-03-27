import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'
import type { SetMetadataInput } from './types'


export const commonLogic = (values: Omit<SetMetadataInput, 'provider'>) => {
  const { options, contracts, userAddress, vaultAddress, metadataIpfsHash } = values

  validateArgs.string({ metadataIpfsHash })

  const baseMulticallArgs = {
    vaultContract: contracts.helpers.createVault(vaultAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setMetadata', args: [ metadataIpfsHash ],
    },
  ]

  return {
    ...baseMulticallArgs,
    request: {
      params,
    },
  }
}
