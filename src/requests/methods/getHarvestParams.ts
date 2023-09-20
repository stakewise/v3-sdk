import { fetchHarvestParamsQuery } from 'graphql/subgraph/vault'


type GetHarvestParamsInput = {
  vaultAddress: string
  options: SDK.Options
}

const getHarvestParams = async (values: GetHarvestParamsInput) => {
  const { options, vaultAddress } = values

  const result = await fetchHarvestParamsQuery({
    network: options.network,
    variables: {
      address: vaultAddress.toLowerCase(),
    },
  })

  return result.harvestParams
}


export default getHarvestParams
