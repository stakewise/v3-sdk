import {
  handleMulticall,
  handleCallStatic,
  getSignedContract,
  handleEstimateGas,
  handleTransactionData,
} from './util'

import type { EigenPodOwnerAbi } from '../types'
import type { MulticallRequestInput } from './types'


type EigenPodOwnerMulticalInput = {
  userAddress: string
  options: StakeWise.Options
  request: MulticallRequestInput
  eigenPodOwnerContract: EigenPodOwnerAbi
}

const eigenPodOwnerMulticall = async <T extends unknown>(values: EigenPodOwnerMulticalInput): Promise<T> => {
  const { request, options, userAddress, eigenPodOwnerContract } = values
  const { params, callStatic, estimateGas, transactionData } = request

  const contract = await getSignedContract({
    contract: eigenPodOwnerContract,
    userAddress,
    options,
    request,
  })

  const multicallParams = [ ...params ]

  const commonInput = {
    contract,
    multicallParams,
  }

  if (callStatic) {
    return handleCallStatic({ ...commonInput, userAddress }) as Promise<T>
  }

  if (estimateGas) {
    return handleEstimateGas(commonInput) as Promise<T>
  }

  if (transactionData) {
    return handleTransactionData(commonInput) as Promise<T>
  }

  return handleMulticall(commonInput)
}


export default eigenPodOwnerMulticall
