import {
  getHarvestArgs,
  handleMulticall,
  handleCallStatic,
  getSignedContract,
  handleEstimateGas,
  handleTransactionData,
} from './util'

import type { BoostAbi } from '../types'
import type { MulticallRequestInput } from './types'


export type BoostMulticallBaseInput = {
  options: StakeWise.Options
  userAddress: string
  vaultAddress: string
  boostContract: BoostAbi
}

type BoostMulticallInput = BoostMulticallBaseInput & {
  request: MulticallRequestInput
}

// Methods with _checkHarvested() call
const harvestCheckMethods = [
  'deposit',
]

/**
 * @description This method will automatically add the execution of the updateState method to the boost,
 * __but this method must be added to the whitelist__ inside the boostMulticall method (harvestCheckMethods)
 */
const boostMulticall = async <T extends unknown>(values: BoostMulticallInput): Promise<T> => {
  const { options, vaultAddress, userAddress, boostContract, request } = values
  const { params, callStatic, estimateGas, transactionData } = request

  const contract = await getSignedContract({
    options,
    contract: boostContract,
    userAddress,
    request,
  })

  const multicallParams = [ ...params ]

  const needHarvest = params.some(({ method }) => harvestCheckMethods.includes(method))

  if (needHarvest) {
    const harvestArgs = await getHarvestArgs<BoostAbi>({
      options,
      vaultAddress,
    })

    if (harvestArgs) {
      multicallParams.push({
        method: 'updateState',
        args: [ harvestArgs ],
      })
    }
  }

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


export default boostMulticall
