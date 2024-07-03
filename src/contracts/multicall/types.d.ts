import { VaultAbi, RewardSplitterAbi, OtherTokenVaultAbi, EigenPodOwnerAbi } from '../types'


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

export type ContractAbi = VaultAbi | OtherTokenVaultAbi | RewardSplitterAbi | EigenPodOwnerAbi
