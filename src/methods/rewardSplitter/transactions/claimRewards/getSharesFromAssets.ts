import { vaultMulticall } from '../../../../contracts'


type GetSharesFromAssetsInput = {
  assets: bigint
  vaultAddress: string
  userAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const getSharesFromAssets = async (input: GetSharesFromAssetsInput) => {
  const { assets, vaultAddress, userAddress, options, contracts } = input

  const request = {
    params: [
      { method: 'convertToShares', args: [ assets ] },
    ],
    callStatic: true,
  }

  const result = await vaultMulticall<[ { shares: bigint } ]>({
    request,
    options,
    userAddress,
    vaultAddress,
    vaultContract: contracts.helpers.createVault({ vaultAddress }),
  })

  return result?.[0]?.shares | 0n
}


export default getSharesFromAssets
