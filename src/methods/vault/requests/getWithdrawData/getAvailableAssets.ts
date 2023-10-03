import { vaultMulticall } from 'contracts'


type GetAvailableAssetsInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const getAvailableAssets = async (values: GetAvailableAssetsInput) => {
  const { options, contracts, vaultAddress, userAddress } = values

  const vaultContract = contracts.helpers.createVaultContract(vaultAddress)

  const result = await vaultMulticall<[ [ bigint ] ]>({
    options,
    userAddress,
    vaultAddress,
    vaultContract,
    keeperContract: contracts.base.keeper,
    request: {
      params: [
        { method: 'withdrawableAssets' },
      ],
      callStatic: true,
    },
  })

  return result?.[0]?.[0] || 0n
}


export default getAvailableAssets
