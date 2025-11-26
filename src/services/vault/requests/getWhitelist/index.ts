import type { WhitelistAccountsQueryVariables, WhitelistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'
import modifyWhitelist from './modifyWhitelist'
import { apiUrls } from '../../../../utils'
import { ModifiedWhitelist } from './types'
import graphql from '../../../../graphql'
import Utils from '../../../utils'


type GetListVariablesInput = StakeWise.ExtractInput<Parameters<Utils['getListVariables']>[0]>

export type GetWhitelistInput = GetListVariablesInput & {
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

const getWhitelist = (input: GetWhitelistInput) => {
  const { options, provider, contracts, ...rest } = input

  const utils = new Utils({ options, provider, contracts })
  const variables = utils.getListVariables<WhitelistAccountsQueryVariables>(rest)

  return graphql.subgraph.vault.fetchWhitelistAccountsQuery<ModifiedWhitelist>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables,
    modifyResult: (data: WhitelistAccountsQueryPayload) => modifyWhitelist({ data }),
  })
}


export default getWhitelist
