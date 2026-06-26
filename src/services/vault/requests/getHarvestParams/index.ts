import * as z from 'zod/mini'

import { apiUrls, schema, parseArgs } from '../../../../helpers'
import graphql from '../../../../graphql'
import modifyHarvestParams from './modifyHarvestParams'


const validateSchema = z.object({
  vaultAddress: schema.ethAddressLower,
})

export type GetHarvestParamsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getHarvestParams = (values: GetHarvestParamsInput) => {
  const { options } = values

  const { vaultAddress } = parseArgs(validateSchema, values)

  return graphql.subgraph.vault.fetchHarvestParamsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: vaultAddress,
    },
    modifyResult: modifyHarvestParams,
  })
}


export default getHarvestParams
