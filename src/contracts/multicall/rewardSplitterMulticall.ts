import {
  getHarvestArgs,
  handleMulticall,
  handleCallStatic,
  getSignedContract,
  handleEstimateGas,
  handleTransactionData,
} from './util'

import type { KeeperAbi, RewardSplitterAbi } from '../types'
import type { MulticallRequestInput } from './types'


type RewardSplittersMulticallInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  request: MulticallRequestInput
  keeperContract: KeeperAbi
  rewardSplitterContract: RewardSplitterAbi
}

const rewardSplittersMulticall = async <T extends unknown>(values: RewardSplittersMulticallInput): Promise<T> => {
  const { request, options, userAddress, vaultAddress, keeperContract, rewardSplitterContract } = values
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
    keeperContract,
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

  if (callStatic) {
    return handleCallStatic({ contract, multicallParams, userAddress }) as Promise<T>
  }

  if (estimateGas) {
    return handleEstimateGas({ contract, multicallParams }) as Promise<T>
  }

  if (transactionData) {
    return handleTransactionData({ contract, multicallParams }) as Promise<T>
  }

  return handleMulticall({ contract, multicallParams })
}


export default rewardSplittersMulticall
