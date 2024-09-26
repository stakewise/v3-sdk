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
    modifyResult: (data) => {
      const allocator = data?.allocators?.[0]
      const ltvStatus = allocator?.ltvStatus
      const assets = BigInt(allocator?.assets || 0)
      const mintedOsTokenShares = BigInt(allocator?.mintedOsTokenShares || 0)

      return {
        assets,
        ltvStatus,
        mintedOsTokenShares,
      }
    },
  })
}


export default getStakeBalance
