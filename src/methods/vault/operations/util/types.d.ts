export type CheckInput = {
  userAddress: string
  vaultAddress: string
  contracts: StakeWise.Contracts
}

export type Action<Input, Output> = (props: Input) => Promise<Output>
