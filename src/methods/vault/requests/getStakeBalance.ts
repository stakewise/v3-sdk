import { vaultMulticall } from '../../../contracts'
import { validateArgs } from '../../../utils'


type GetStakeBalanceInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const getStakeBalance = async (values: GetStakeBalanceInput) => {
  const { contracts, options, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

  const vaultContract = contracts.helpers.createVaultContract(vaultAddress)

  const balanceShares = await vaultContract.balanceOf(userAddress)

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


export default getStakeBalance
