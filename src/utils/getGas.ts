type GetGasInput = {
  provider: StakeWise.Provider
  estimatedGas: bigint
}

const getGas = async (value: GetGasInput): Promise<bigint> => {
  const { provider, estimatedGas } = value

  const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData()

  const isEIP1559 = Boolean(maxFeePerGas && maxPriorityFeePerGas)

  const gas = isEIP1559
    ? estimatedGas * (maxFeePerGas as bigint)
    : estimatedGas * (gasPrice as bigint)

  return gas
}


export default getGas
