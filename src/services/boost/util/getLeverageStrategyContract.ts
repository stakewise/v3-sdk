import getLeverageStrategyData from '../requests/getLeverageStrategyData'


type GetLeverageStrategyContractInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
  leverageStrategyData?: {
    version: number
    isUpgradeRequired: boolean
  }
}

const getLeverageStrategyContract = async (values: GetLeverageStrategyContractInput) => {
  const { contracts } = values

  const leverageStrategyData = values.leverageStrategyData
    ? values.leverageStrategyData
    : await getLeverageStrategyData(values)

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
