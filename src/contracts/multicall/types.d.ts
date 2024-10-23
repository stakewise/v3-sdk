import { RewardSplitterAbi, EigenPodOwnerAbi, BoostAbi } from '../types'


export type MulticallParameter = {
  method: string
  args?: any[]
}

export type MulticallRequestInput = {
  params: MulticallParameter[]
  callStatic?: boolean
  estimateGas?: boolean
  transactionData?: boolean
}

export type ContractAbi = ReturnType<StakeWise.Contracts['helpers']['createVault']> | RewardSplitterAbi | EigenPodOwnerAbi | BoostAbi
