import {
  getHarvestArgs,
  handleMulticall,
  handleCallStatic,
  getSignedContract,
  handleEstimateGas,
  handleTransactionData,
} from './util'

import type { LeverageStrategyAbi } from '../types'
import type { MulticallRequestInput } from './types'


export type BoostMulticallBaseInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
  leverageStrategyContract: LeverageStrategyAbi
}

type BoostMulticallInput = BoostMulticallBaseInput & {
  request: MulticallRequestInput
}

// Methods with _checkHarvested() call
const harvestCheckMethods = [
  'deposit',
  'enterExitQueue',
  'claimExitedAssets',
]

/**
 * @description This method will automatically add the execution of the updateState method to the boost,
 * __but this method must be added to the whitelist__ inside the boostMulticall method (harvestCheckMethods)
 */
const boostMulticall = async <T extends unknown>(values: BoostMulticallInput): Promise<T> => {
  const { options, vaultAddress, userAddress, leverageStrategyContract, request } = values
  const { params, callStatic, estimateGas, transactionData } = request

  const contract = await getSignedContract({
    contract: leverageStrategyContract,
    userAddress,
    options,
    request,
  })

  let multicallParams = [ ...params ]

  const needHarvest = params.some(({ method }) => harvestCheckMethods.includes(method))

  if (needHarvest) {
    const harvestArgs = await getHarvestArgs(values)

    if (harvestArgs) {
      multicallParams = [
        {
          method: 'updateVaultState',
          args: [ vaultAddress, harvestArgs ],
        },
        ...multicallParams,
      ]
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
