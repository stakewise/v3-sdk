import type { WhitelistAccountsQueryVariables, WhitelistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'
import { apiUrls } from '../../../../utils'
import graphql from '../../../../graphql'
import { ModifiedWhitelist } from './types'
import modifyWhitelist from './modifyWhitelist'
import { getListVariables, GetListVariablesInput } from '../../../utils'


type GetWhitelistInput = GetListVariablesInput & {
  options: StakeWise.Options
}

const getWhitelist = (input: GetWhitelistInput) => {
  const { options, ...rest } = input

  const variables = getListVariables<WhitelistAccountsQueryVariables>(rest)

  return graphql.subgraph.vault.fetchWhitelistAccountsQuery<ModifiedWhitelist>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables,
    modifyResult: (data: WhitelistAccountsQueryPayload) => modifyWhitelist({ data }),
  })
}


export default getWhitelist
