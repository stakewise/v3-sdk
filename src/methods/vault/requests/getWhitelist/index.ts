import type { WhitelistAccountsQueryVariables, WhitelistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'
import { ModifiedWhitelist } from './types'
import modifyWhitelist from './modifyWhitelist'


type GetWhitelistInput = {
  vaultAddress: string
  orderDirection?: WhitelistAccountsQueryVariables['orderDirection']
  search?: string
  limit?: number
  skip?: number
  options: StakeWise.Options
}

type GetWhitelistOutput = {
  whitelist: {
    createdAt: number
    address: string
  }[]
}

const getWhitelist = async (input: GetWhitelistInput): Promise<GetWhitelistOutput> => {
  const { vaultAddress, orderDirection, search, limit, skip, options } = input

  validateArgs.address({ vaultAddress })

  if (typeof skip !== 'undefined') {
    validateArgs.number({ skip })
  }

  if (typeof limit !== 'undefined') {
    validateArgs.number({ limit })
  }

  if (typeof search !== 'undefined') {
    validateArgs.string({ search })
  }

  if (typeof orderDirection !== 'undefined') {
    if (![ 'asc', 'desc' ].includes(orderDirection)) {
      throw new Error(`The "orderDirection" argument must be "asc" or "desc"`)
    }
  }

  const where = search
    ? { vault: vaultAddress, address_contains: search } as WhitelistAccountsQueryVariables['where']
    : { vault: vaultAddress } as WhitelistAccountsQueryVariables['where']

  return graphql.subgraph.vault.fetchWhitelistAccountsQuery<ModifiedWhitelist>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      where,
      skip: skip || 0,
      limit: limit || 100,
      orderDirection: orderDirection || 'desc',
    },
    modifyResult: (data: WhitelistAccountsQueryPayload) => modifyWhitelist({ data }),
  })
}


export default getWhitelist
