import type { ValidatorsQueryPayload, ValidatorsQueryVariables } from '../../../../graphql/backend/vault'
import { apiUrls, validateArgs } from '../../../../helpers'
import type { ModifiedValidators } from './types'
import modifyValidators from './modifyValidators'
import graphql from '../../../../graphql'


export type GetValidatorsInput = StakeWise.CommonParams & {
  vaultAddress: ValidatorsQueryVariables['vaultAddress']
  limit: ValidatorsQueryVariables['first']
  skip: ValidatorsQueryVariables['skip']
}

const getValidators = (input: GetValidatorsInput) => {
  const { options, skip, limit, vaultAddress } = input

  validateArgs.address({ vaultAddress })
  validateArgs.number({ skip, limit })

  return graphql.backend.vault.fetchValidatorsQuery<ModifiedValidators>({
    url: apiUrls.getBackendUrl(options),
    variables: {
      vaultAddress: vaultAddress.toLowerCase(),
      skip,
      first: limit,
    },
    modifyResult: (data: ValidatorsQueryPayload) => modifyValidators({ data, network: options.network }),
  })
}


export default getValidators
