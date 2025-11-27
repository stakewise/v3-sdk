import { apiUrls, validateArgs } from '../../../../helpers'
import graphql from '../../../../graphql'


export type GetStakeBalanceInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
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
      totalEarnedAssets: BigInt(data?.allocators?.[0]?.totalEarnedAssets || 0),
      totalStakeEarnedAssets: BigInt(data?.allocators?.[0]?.totalStakeEarnedAssets || 0),
      totalBoostEarnedAssets: BigInt(data?.allocators?.[0]?.totalBoostEarnedAssets || 0),
    }),
  })
}


export default getStakeBalance
