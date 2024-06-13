import handleEstimateGas from './handleEstimateGas'
import { ContractAbi, MulticallParameter } from '../types'


type Input = {
  contract: ContractAbi
  multicallParams: MulticallParameter[]
}

const getSwapParams = async ({ contract, multicallParams }: Input) => {
  const swapParams = {
    method: 'swapXdaiToGno',
    args: [],
  }

  const updatedMulticallParams = multicallParams.concat(swapParams)

  try {
    await handleEstimateGas({
      contract,
      multicallParams: updatedMulticallParams,
    })

    return swapParams
  }
  catch {
    return null
  }
}


export default getSwapParams
