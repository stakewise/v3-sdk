import { apiUrls, validateArgs } from '../../../../helpers'
import graphql from '../../../../graphql'


export type GetOsTokenConfigInput = StakeWise.CommonParams & {
  vaultAddress: string
}

const getOsTokenConfig = async (input: GetOsTokenConfigInput) => {
  const { options, vaultAddress } = input

  validateArgs.address({ vaultAddress })

  return graphql.subgraph.vault.fetchVaultOsTokenConfigQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: vaultAddress.toLowerCase(),
    },
    modifyResult: (data) => data.vault.osTokenConfig,
  })
}


export default getOsTokenConfig
