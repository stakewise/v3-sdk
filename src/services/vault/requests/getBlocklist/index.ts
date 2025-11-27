import type { BlocklistAccountsQueryVariables, BlocklistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'
import graphql from '../../../../graphql'
import { ModifiedBlocklist } from './types'
import { apiUrls } from '../../../../helpers'
import modifyBlocklist from './modifyBlocklist'
import Util, { GetListVariablesInput } from '../../../utils'


export type GetBlocklistInput = GetListVariablesInput & StakeWise.CommonParams

const getBlocklist = (values: GetBlocklistInput) => {
  const { options, ...rest } = values

  const utils = new Util(values)
  const variables = utils.getListVariables<BlocklistAccountsQueryVariables>(rest)

  return graphql.subgraph.vault.fetchBlocklistAccountsQuery<ModifiedBlocklist>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables,
    modifyResult: (data: BlocklistAccountsQueryPayload) => modifyBlocklist({ data }),
  })
}


export default getBlocklist
