import validateArgs from './validateArgs'


type GetGasInput = {
  provider: StakeWise.Provider
  estimatedGas: bigint
}

const getGas = async (value: GetGasInput): Promise<bigint> => {
  const { provider, estimatedGas } = value

  validateArgs.bigint({ estimatedGas })

  const [ feeData, latestBlock ] = await Promise.all([
    provider.getFeeData(),
    provider.getBlock('latest'),
  ])

  const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = feeData
  const baseFeePerGas = latestBlock?.baseFeePerGas || 0n

  const isEIP1559 = Boolean(maxFeePerGas && maxPriorityFeePerGas)

  const gas = isEIP1559
    ? estimatedGas * (baseFeePerGas + (maxPriorityFeePerGas || 0n))
    : estimatedGas * (gasPrice as bigint)

  return gas
}


export default getGas
