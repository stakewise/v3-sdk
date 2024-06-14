import handleEstimateGas from './handleEstimateGas'
import { ContractAbi, MulticallParameter } from '../types'


type Input = {
  contract: ContractAbi
  multicallParams: MulticallParameter[]
  fallbackParams: MulticallParameter[]
}

const testMulticallParams = async ({ contract, multicallParams, fallbackParams }: Input) => {
  try {
    await handleEstimateGas({
      contract,
      multicallParams,
    })

    return multicallParams
  }
  catch {
    return fallbackParams
  }
}


export default testMulticallParams
