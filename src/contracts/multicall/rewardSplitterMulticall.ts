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


export default rewardSplittersMulticall
