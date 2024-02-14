import type { BlocklistAccountsQueryVariables, BlocklistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'
import { ModifiedBlocklist } from './types'
import modifyBlocklist from './modifyBlocklist'


type GetBlocklistInput = {
  vaultAddress: string
  orderDirection?: BlocklistAccountsQueryVariables['orderDirection']
  search?: string
  limit?: number
  skip?: number
  options: StakeWise.Options
}

type GetBlocklistOutput = {
  blocklist: {
    createdAt: number
    address: string
  }[]
}

const getBlocklist = async (input: GetBlocklistInput): Promise<GetBlocklistOutput> => {
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
    ? { vault: vaultAddress, address_contains: search } as BlocklistAccountsQueryVariables['where']
    : { vault: vaultAddress } as BlocklistAccountsQueryVariables['where']

  const data = await graphql.subgraph.vault.fetchBlocklistAccountsQuery<ModifiedBlocklist>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      where,
      skip: skip || 0,
      limit: limit || 100,
      orderDirection: orderDirection || 'desc',
    },
    modifyResult: (data: BlocklistAccountsQueryPayload) => modifyBlocklist({ data }),
  })

  return {
    blocklist: data,
  }
}


export default getBlocklist
