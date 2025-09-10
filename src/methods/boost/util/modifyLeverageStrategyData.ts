import { LeverageStrategyDataQueryPayload } from '../../../graphql/subgraph/boost'


export type Output = {
  version: number
  isUpgradeRequired: boolean
}

const modifyLeverageStrategyData = (values: LeverageStrategyDataQueryPayload): Output => {
  const { leverageStrategyPositions } = values

  const leverageStrategyData = leverageStrategyPositions[0]

  if (!leverageStrategyData) {
    return {
      version: 2,
      isUpgradeRequired: false,
    }
  }

  const version = Number(leverageStrategyData.version) || 1
  const exitingPercent = Number(leverageStrategyData.exitingPercent)

  return {
    version,
    isUpgradeRequired: version === 1 && exitingPercent === 0,
  }
}


export default modifyLeverageStrategyData
