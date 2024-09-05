import {
  getHarvestArgs,
  handleMulticall,
  handleCallStatic,
  getSignedContract,
  handleEstimateGas,
  handleTransactionData,
} from './util'

import type { RewardSplitterAbi } from '../types'
import type { MulticallRequestInput } from './types'


export type RewardSplitterMulticallBaseInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  rewardSplitterContract: RewardSplitterAbi
}

type RewardSplitterMulticallInput = RewardSplitterMulticallBaseInput & {
  request: MulticallRequestInput
}

const rewardSplitterMulticall = async <T extends unknown>(values: RewardSplitterMulticallInput): Promise<T> => {
  const { request, options, userAddress, vaultAddress, rewardSplitterContract } = values
  const { params, callStatic, estimateGas, transactionData } = request

  let multicallParams = [ ...params ]

  const contract = await getSignedContract({
    contract: rewardSplitterContract,
    userAddress,
    options,
    request,
  })

  const harvestArgs = await getHarvestArgs<RewardSplitterAbi>({
    options,
    vaultAddress,
  })

  if (harvestArgs) {
    multicallParams = [
      {
        method: 'updateVaultState',
        args: [ harvestArgs ],
      },
      ...multicallParams,
    ]
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


export default rewardSplitterMulticall
