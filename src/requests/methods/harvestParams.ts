import { fetchHarvestParamsQuery } from 'graphql/subgraph/vault'


type HarvestParamsInput = {
  vaultAddress: string
  options: SDK.Options
}

const harvestParams = async (values: HarvestParamsInput) => {
  const { options, vaultAddress } = values

  const result = await fetchHarvestParamsQuery({
    network: options.network,
    variables: {
      address: vaultAddress.toLowerCase(),
    },
  })

  return result.harvestParams
}


export default harvestParams
