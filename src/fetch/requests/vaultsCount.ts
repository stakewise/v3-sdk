import { Network } from 'helpers'
import { subgraph } from 'graphql'
import { ZeroAddress } from 'ethers'


type VaultsCountInput = {
  address?: string
  network: Network
}

const vaultsCount = async (input: VaultsCountInput) => {
  const { network, address } = input

  const data = await subgraph.vaultsCount.fetchVaultsCountQuery({
    network,
    variables: {
      address: address || ZeroAddress,
    },
  })

  return {
    all: data?.all?.vaultsTotal || 0,
    deposits: data?.deposits?.length || 0,
  }
}


export default vaultsCount
