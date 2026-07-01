import type * as z from 'zod/mini'

import graphql from '../../../../graphql'
import { apiUrls } from '../../../../helpers'
import modifyHarvestParams from './modifyHarvestParams'

import { validate, validateSchema } from './validate'


export type GetHarvestParamsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getHarvestParams = (values: GetHarvestParamsInput) => {
  const { options } = values

  const { vaultAddress } = validate(values)

  return graphql.subgraph.vault.fetchHarvestParamsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: vaultAddress,
    },
    modifyResult: modifyHarvestParams,
  })
}


export default getHarvestParams
