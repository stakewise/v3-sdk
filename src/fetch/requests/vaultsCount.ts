import { Network } from 'helpers'
import { subgraph } from 'graphql'
import { ZeroAddress } from 'ethers'


type VaultsCountInput = {
  userAddress?: string
  network: Network
}

const vaultsCount = async (input: VaultsCountInput) => {
  const { network, userAddress } = input

  const data = await subgraph.vaultsCount.fetchVaultsCountQuery({
    network,
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
