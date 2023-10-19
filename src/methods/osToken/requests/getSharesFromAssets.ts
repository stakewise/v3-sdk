type GetSharesFromAssetsInput = {
  contracts: StakeWise.Contracts
  amount: bigint
}

const getSharesFromAssets = async (values: GetSharesFromAssetsInput) => {
  const { contracts, amount } = values

  const result = await contracts.tokens.mintToken.convertToShares(amount)

  return result || 0n
}


export default getSharesFromAssets
