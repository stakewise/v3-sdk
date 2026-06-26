import * as z from 'zod/mini'

import type { ValidatorsQueryPayload } from '../../../../graphql/backend/vault'
import { apiUrls, schema, parseArgs } from '../../../../helpers'
import type { ModifiedValidators } from './types'
import modifyValidators from './modifyValidators'
import graphql from '../../../../graphql'


const validateSchema = z.object({
  vaultAddress: schema.ethAddressLower,
  limit: schema.number,
  skip: schema.number,
})

export type GetValidatorsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getValidators = (input: GetValidatorsInput) => {
  const { options, skip, limit } = input

  const { vaultAddress } = parseArgs(validateSchema, input)

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
