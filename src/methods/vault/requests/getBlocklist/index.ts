import type { BlocklistAccountsQueryVariables, BlocklistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'
import { apiUrls } from '../../../../utils'
import graphql from '../../../../graphql'
import { ModifiedBlocklist } from './types'
import modifyBlocklist from './modifyBlocklist'
import { getListVariables, GetListVariablesInput } from '../../../utils'


type GetBlocklistInput = GetListVariablesInput & {
  options: StakeWise.Options
}

const getBlocklist = (input: GetBlocklistInput) => {
  const { options, ...rest } = input

  const variables = getListVariables<BlocklistAccountsQueryVariables>(rest)

  return graphql.subgraph.vault.fetchBlocklistAccountsQuery<ModifiedBlocklist>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables,
    modifyResult: (data: BlocklistAccountsQueryPayload) => modifyBlocklist({ data }),
  })
}


export default getBlocklist
