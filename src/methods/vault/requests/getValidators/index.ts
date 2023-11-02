import type { VaultValidatorsQueryVariables, VaultValidatorsQueryPayload } from '../../../../graphql/backend/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import type { ModifiedValidators } from './types'
import modifyValidators from './modifyValidators'
import graphql from '../../../../graphql'


type GetValidatorsInput = {
  options: StakeWise.Options
  vaultAddress: VaultValidatorsQueryVariables['address']
}

const getValidators = async (input: GetValidatorsInput) => {
  const { options, vaultAddress } = input

  validateArgs.address({ vaultAddress })

  const data = await graphql.backend.vault.fetchVaultValidatorsQuery<ModifiedValidators>({
    url: apiUrls.getBackendUrl(options),
    variables: { address: vaultAddress.toLowerCase() },
    modifyResult: (data: VaultValidatorsQueryPayload) => modifyValidators({ data, network: options.network }),
  })

  return data
}


export default getValidators
