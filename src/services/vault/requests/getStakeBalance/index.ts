import { z } from 'zod'

import { apiUrls, schema, parseArgs } from '../../../../helpers'
import graphql from '../../../../graphql'


const validateSchema = z.object({
  userAddress: schema.ethAddressLower,
  vaultAddress: schema.ethAddressLower,
})

export type GetStakeBalanceInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getStakeBalance = (values: GetStakeBalanceInput) => {
  const { options } = values

  const { userAddress, vaultAddress } = parseArgs(validateSchema, values)

  return graphql.subgraph.allocator.fetchAllocatorsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      vaultAddress,
      address: userAddress,
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
