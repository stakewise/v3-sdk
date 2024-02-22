import { vaultMulticall } from '../../../contracts'
import { validateArgs } from '../../../utils'
import { wrapAbortPromise } from '../../../modules/gql-module'


type GetStakeBalanceInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

type Output = {
  shares: bigint
  assets: bigint
}

const getStakeBalance = async (values: GetStakeBalanceInput) => {
  const { contracts, options, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

  const vaultContract = contracts.helpers.createVault(vaultAddress)

  const balanceShares = await vaultContract.getShares(userAddress)

  const result = await vaultMulticall<[ [ bigint ] ]>({
    options,
    userAddress,
    vaultAddress,
    vaultContract,
    keeperContract: contracts.base.keeper,
    request: {
      callStatic: true,
      params: [
        {
          method: 'convertToAssets',
          args: [ balanceShares ],
        },
      ],
    },
  })

  return {
    shares: balanceShares || 0n,
    assets: result?.[0]?.[0] || 0n,
  }
}


export default wrapAbortPromise<GetStakeBalanceInput, Output>(getStakeBalance)
