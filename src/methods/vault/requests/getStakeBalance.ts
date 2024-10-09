import { apiUrls, validateArgs } from '../../../utils'
import graphql from '../../../graphql'


type GetStakeBalanceInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const getStakeBalance = (values: GetStakeBalanceInput) => {
  const { options, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

  return graphql.subgraph.allocator.fetchAllocatorsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    },
    modifyResult: (data) => ({
      assets: BigInt(data?.allocators?.[0]?.assets || 0),
    }),
  })
}


export default getStakeBalance
