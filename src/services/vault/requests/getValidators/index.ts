import type * as z from 'zod/mini'

import type { ValidatorsQueryPayload } from '../../../../graphql/backend/vault'
import { apiUrls } from '../../../../helpers'
import graphql from '../../../../graphql'

import type { ModifiedValidators } from './types'
import modifyValidators from './modifyValidators'
import { validate, validateSchema } from './validate'


export type GetValidatorsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getValidators = (input: GetValidatorsInput) => {
  const { options, skip, limit } = input

  const { vaultAddress } = validate(input)

  return graphql.backend.vault.fetchValidatorsQuery<ModifiedValidators>({
    url: apiUrls.getBackendUrl(options),
    variables: {
      skip,
      first: limit,
      vaultAddress,
    },
    modifyResult: (data: ValidatorsQueryPayload) => modifyValidators({ data, network: options.network }),
  })
}


export default getValidators
