import { isAddress } from 'ethers'
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
  addressIn?: BlocklistAccountsQueryVariables['where']['address_in']
  options: StakeWise.Options
}

const validateList = (addressIn: string[]) => {
  const isValid = addressIn.every((address) => isAddress(address))

  if (!isValid) {
    throw new Error('The "addressIn" argument must be an array of valid addresses')
  }
}

const getBlocklist = (input: GetBlocklistInput) => {
  const { vaultAddress, orderDirection, search, limit, skip, addressIn, options } = input

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

  if (typeof addressIn !== 'undefined') {
    validateArgs.array({ addressIn })
    validateList(addressIn)
  }

  const vault = vaultAddress.toLowerCase()

  const where = search
    ? { vault, address_in: addressIn, address_contains: search.toLowerCase() } as BlocklistAccountsQueryVariables['where']
    : { vault, address_in: addressIn } as BlocklistAccountsQueryVariables['where']

  return graphql.subgraph.vault.fetchBlocklistAccountsQuery<ModifiedBlocklist>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      where,
      skip: skip || 0,
      limit: limit || 100,
      orderDirection: orderDirection || 'desc',
    },
    modifyResult: (data: BlocklistAccountsQueryPayload) => modifyBlocklist({ data }),
  })
}


export default getBlocklist
