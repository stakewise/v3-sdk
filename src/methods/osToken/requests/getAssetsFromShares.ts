type GetAssetsFromSharesInput = {
  contracts: StakeWise.Contracts
  amount: bigint
}

const getAssetsFromShares = async (values: GetAssetsFromSharesInput) => {
  const { contracts, amount } = values

  const result = await contracts.base.mintTokenController.convertToAssets(amount)

  return result || 0n
}


export default getAssetsFromShares
