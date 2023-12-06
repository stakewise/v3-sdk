import type { ValidatorsQueryPayload, ValidatorsQueryVariables } from '../../../../graphql/backend/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import type { ModifiedValidators } from './types'
import modifyValidators from './modifyValidators'
import graphql from '../../../../graphql'


type GetValidatorsInput = {
  options: StakeWise.Options
  vaultAddress: ValidatorsQueryVariables['vaultAddress']
  skip: ValidatorsQueryVariables['skip']
  limit: ValidatorsQueryVariables['first']
}

const getValidators = async (input: GetValidatorsInput) => {
  const { options, skip, limit, vaultAddress } = input

  validateArgs.address({ vaultAddress })
  validateArgs.number({ skip, limit })

  const data = await graphql.backend.vault.fetchValidatorsQuery<ModifiedValidators>({
    url: apiUrls.getBackendUrl(options),
    variables: {
      vaultAddress: vaultAddress.toLowerCase(),
      skip,
      first: limit,
    },
    modifyResult: (data: ValidatorsQueryPayload) => modifyValidators({ data, network: options.network }),
  })

  return data
}


export default getValidators
