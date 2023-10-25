import encodeWithdraw from './encodeWithdraw'


export type WithdrawInput = {
  assets: bigint
  userAddress: string
  vaultAddress: string
  availableAssets: bigint
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

export interface Withdraw {
  (values: WithdrawInput): Promise<StakeWise.TransactionHash>
  encode: typeof encodeWithdraw
}
