import { vaultMulticall } from '../../../../contracts'


type GetAssetsFromSharesInput = {
  shares: bigint
  vaultAddress: string
  userAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const getAssetsFromShares = async (input: GetAssetsFromSharesInput) => {
  const { shares, vaultAddress, userAddress, options, contracts } = input

  const request = {
    params: [
      { method: 'convertToAssets', args: [ shares ] },
    ],
    callStatic: true,
  }

  const result = await vaultMulticall<[ { assets: bigint } ]>({
    request,
    options,
    userAddress,
    vaultAddress,
    vaultContract: contracts.helpers.createVault(vaultAddress),
  })

  return result?.[0]?.assets | 0n
}


export default getAssetsFromShares
