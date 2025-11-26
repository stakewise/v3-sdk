import getLeverageStrategyData from '../requests/getLeverageStrategyData'


type Input = {
  options: StakeWise.Options
  contracts: StakeWise.Contracts
  userAddress: string
  vaultAddress: string
  leverageStrategyData?: {
    version: number
    isUpgradeRequired: boolean
  }
}

const getLeverageStrategyContract = async (values: Input) => {
  const { options, contracts, userAddress, vaultAddress } = values

  const leverageStrategyData = values.leverageStrategyData
    ? values.leverageStrategyData
    : await getLeverageStrategyData({ options, userAddress, vaultAddress })

  let leverageStrategyContract = contracts.special.leverageStrategy

  if (!leverageStrategyData || leverageStrategyData.version === 2 || leverageStrategyData.isUpgradeRequired) {
    leverageStrategyContract = contracts.special.leverageStrategyV2
  }

  return {
    leverageStrategyContract: leverageStrategyContract,
    isUpgradeRequired: leverageStrategyData?.isUpgradeRequired
  }
}


export default getLeverageStrategyContract
