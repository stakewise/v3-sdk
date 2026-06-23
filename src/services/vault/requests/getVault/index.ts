import { z } from 'zod'

import { apiUrls, schema, parseArgs } from '../../../../helpers'
import graphql from '../../../../graphql'
import { ModifiedVault } from './types'
import modifyVault from './modifyVault'


const validateSchema = z.object({
  vaultAddress: schema.ethAddress,
})

export type GetVaultInput = StakeWise.CommonParams & {
  vaultAddress: string
  withTime?: boolean
}

const getVault = (input: GetVaultInput) => {
  const { options, vaultAddress, withTime } = input

  parseArgs(validateSchema, input)

  return graphql.subgraph.vault.fetchVaultQuery<ModifiedVault>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: vaultAddress.toLowerCase(),
    },
    withTime,
    modifyResult: (data) => modifyVault({ data, network: options.network }),
  })
}


export default getVault
