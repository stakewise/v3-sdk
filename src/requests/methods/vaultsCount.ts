import { subgraph } from 'graphql'
import { ZeroAddress } from 'ethers'


type VaultsCountInput = {
  userAddress?: string
  options: SDK.Options
}

const vaultsCount = async (input: VaultsCountInput) => {
  const { options, userAddress } = input

  const data = await subgraph.vaultsCount.fetchVaultsCountQuery({
    network: options.network,
    variables: {
      address: userAddress?.toLowerCase() || ZeroAddress,
    },
  })

  return {
    all: data?.all?.vaultsTotal || 0,
    deposits: data?.deposits?.length || 0,
  }
}


export default vaultsCount
