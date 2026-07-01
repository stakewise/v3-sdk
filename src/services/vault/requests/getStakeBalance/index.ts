import graphql from '../../../../graphql'
import { apiUrls } from '../../../../helpers'

import { validate } from './validate'


export type GetStakeBalanceInput = StakeWise.BaseInput

const getStakeBalance = (values: GetStakeBalanceInput) => {
  const { options } = values

  const { userAddress, vaultAddress } = validate(values)

  return graphql.subgraph.allocator.fetchAllocatorsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      vaultAddress: vaultAddress.toLowerCase(),
      address: userAddress.toLowerCase(),
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
