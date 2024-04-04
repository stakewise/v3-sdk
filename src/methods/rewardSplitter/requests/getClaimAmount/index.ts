import type { BlocklistAccountsQueryVariables, BlocklistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'
import { ModifiedBlocklist } from './types'
import modifyBlocklist from './modifyBlocklist'


type GetClaimAmountInput = {
  vaultAddress: string
  userAddress: string
  rewardSplitterAddress: string
  options: StakeWise.Options
}

const getClaimAmount = (input: GetClaimAmountInput) => {
  const { vaultAddress, userAddress, rewardSplitterAddress, options } = input

  validateArgs.address({ vaultAddress, userAddress, rewardSplitterAddress })

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


export default getClaimAmount
