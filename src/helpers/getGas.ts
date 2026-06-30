import * as z from 'zod/mini'

import schema from './schemas'
import parseArgs from './parseArgs'


const validateSchema = z.object({
  estimatedGas: schema.bigint,
})

type GetGasInput = {
  provider: StakeWise.Provider
} & z.input<typeof validateSchema>

const getGas = async (value: GetGasInput): Promise<bigint> => {
  const { provider, estimatedGas } = value

  parseArgs(validateSchema, value)

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
