import { validateArgs } from '../../../utils'


const validateLeverageStrategyData = (leverageStrategyData?: unknown) => {
  if (leverageStrategyData) {
    validateArgs.object({ leverageStrategyData })
    validateArgs.number({ 'leverageStrategyData.version': leverageStrategyData.version })
    validateArgs.boolean({ 'leverageStrategyData.isUpgradeRequired': leverageStrategyData.isUpgradeRequired })
  }
}


export default validateLeverageStrategyData
