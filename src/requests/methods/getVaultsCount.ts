import { apiUrls } from 'helpers'
import { subgraph } from 'graphql'
import { ZeroAddress } from 'ethers'


type GetVaultsCountInput = {
  userAddress?: string
  options: SDK.Options
}

const getVaultsCount = async (input: GetVaultsCountInput) => {
  const { options, userAddress } = input

  const data = await subgraph.vaultsCount.fetchVaultsCountQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: userAddress?.toLowerCase() || ZeroAddress,
    },
  })

  return {
    all: data?.all?.vaultsTotal || 0,
    deposits: data?.deposits?.length || 0,
  }
}


export default getVaultsCount
