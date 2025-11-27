import { vaultMulticall } from '../../../../contracts'


type GetSharesFromAssetsInput = StakeWise.CommonParams & {
  assets: bigint
  userAddress: string
  vaultAddress: string
}

const getSharesFromAssets = async (values: GetSharesFromAssetsInput) => {
  const { assets, vaultAddress, contracts } = values

  const request = {
    params: [
      { method: 'convertToShares', args: [ assets ] },
    ],
    callStatic: true,
  }

  const result = await vaultMulticall<[ { shares: bigint } ]>({
    vaultContract: contracts.helpers.createVault({ vaultAddress }),
    request,
    ...values,
  })

  return result?.[0]?.shares | 0n
}


export default getSharesFromAssets
