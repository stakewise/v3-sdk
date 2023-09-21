import { vaultMulticall } from 'contracts'


type GetStakeBalanceInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const getStakeBalance = async (values: GetStakeBalanceInput) => {
  const { contracts, options, vaultAddress, userAddress } = values

  console.log('userAddress', userAddress)
  console.log('vaultAddress', vaultAddress)
  const vaultContract = contracts.helpers.createVaultContract(vaultAddress)

  console.log(0)
  const balanceShares = await vaultContract.balanceOf(userAddress)

  console.log(11)
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
  console.log(22)

  return {
    shares: balanceShares || 0n,
    assets: result?.[0]?.[0] || 0n,
  }
}


export default getStakeBalance
