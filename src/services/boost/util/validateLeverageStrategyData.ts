import { validateArgs } from '../../../utils'


type LeverageStrategyData = {
  version: number
  isUpgradeRequired: boolean
}

const validateLeverageStrategyData = (leverageStrategyData?: unknown) => {
  if (leverageStrategyData) {
    validateArgs.object({ leverageStrategyData })
    validateArgs.number({
      'leverageStrategyData.version': (leverageStrategyData as LeverageStrategyData).version,
    })
    validateArgs.boolean({
      'leverageStrategyData.isUpgradeRequired': (leverageStrategyData as LeverageStrategyData).isUpgradeRequired,
    })
  }
}


export default validateLeverageStrategyData
