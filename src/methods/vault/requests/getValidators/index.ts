import { backend } from 'graphql'
import { apiUrls, validateArgs } from 'helpers'
import { VaultValidatorsQueryVariables, VaultValidatorsQueryPayload } from 'graphql/backend/vault'

import type { ModifiedValidators } from './types'
import modifyValidators from './modifyValidators'


type GetValidatorsInput = {
  options: StakeWise.Options
  vaultAddress: VaultValidatorsQueryVariables['address']
}

const getValidators = async (input: GetValidatorsInput) => {
  const { options, vaultAddress } = input

  validateArgs.address({ vaultAddress })

  const data = await backend.vault.fetchVaultValidatorsQuery<ModifiedValidators>({
    url: apiUrls.getBackendUrl(options),
    variables: { address: vaultAddress.toLowerCase() },
    modifyResult: (data: VaultValidatorsQueryPayload) => modifyValidators({ data, network: options.network }),
  })

  return data
}


export default getValidators
