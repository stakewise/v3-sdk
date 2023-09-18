import { Network } from 'helpers'
import { fetchHarvestParamsQuery } from 'graphql/subgraph/vault'


type HarvestParamsInput = {
  vaultAddress: string
  network: Network
}

const harvestParams = async (values: HarvestParamsInput) => {
  const { network, vaultAddress } = values

  const result = await fetchHarvestParamsQuery({
    network,
    variables: {
      address: vaultAddress.toLowerCase(),
    },
  })

  return result.harvestParams
}


export default harvestParams
