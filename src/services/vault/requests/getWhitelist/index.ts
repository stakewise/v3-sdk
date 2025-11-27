import type { WhitelistAccountsQueryVariables, WhitelistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'
import modifyWhitelist from './modifyWhitelist'
import { apiUrls } from '../../../../helpers'
import { ModifiedWhitelist } from './types'
import graphql from '../../../../graphql'
import Utils from '../../../utils'


type GetListVariablesInput = StakeWise.ExtractInput<Parameters<Utils['getListVariables']>[0]>

export type GetWhitelistInput = GetListVariablesInput & StakeWise.CommonParams

const getWhitelist = (values: GetWhitelistInput) => {
  const { options, provider, contracts, ...rest } = values

  const utils = new Utils(values)
  const variables = utils.getListVariables<WhitelistAccountsQueryVariables>(rest)

  return graphql.subgraph.vault.fetchWhitelistAccountsQuery<ModifiedWhitelist>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables,
    modifyResult: (data: WhitelistAccountsQueryPayload) => modifyWhitelist({ data }),
  })
}


export default getWhitelist
