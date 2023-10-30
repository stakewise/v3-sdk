type GetSharesFromAssetsInput = {
  contracts: StakeWise.Contracts
  amount: bigint
}

const getSharesFromAssets = async (values: GetSharesFromAssetsInput) => {
  const { contracts, amount } = values

  const result = await contracts.base.mintTokenController.convertToShares(amount)

  return result || 0n
}


export default getSharesFromAssets
