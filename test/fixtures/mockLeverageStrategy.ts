import type { LeverageStrategyDataQueryPayload } from '../../src/graphql/subgraph/boost'

import type { MockRunner } from '../mockRunner'

import type { Fixture } from './types'


type Positions = LeverageStrategyDataQueryPayload['leverageStrategyPositions']

type MockLeverageStrategyInput = {
  canHarvest?: boolean
  positions?: Positions
  answers?: Parameters<MockRunner['on']>[1]
}

export type MockLeverageStrategyFixture = (values?: MockLeverageStrategyInput) => (
  StakeWise.Contracts['special']['leverageStrategyV2']
)

type Dependencies = 'sdk' | 'runner' | 'graphql'

const mockLeverageStrategy: Fixture<'mockLeverageStrategy', Dependencies> = ({ sdk, runner, graphql }) => (
  (values: MockLeverageStrategyInput = {}) => {
    const { canHarvest = false, positions = [], answers = {} } = values
    const leverageStrategyContract = sdk.contracts.special.leverageStrategy
    const leverageStrategyV2Contract = sdk.contracts.special.leverageStrategyV2
    const strategyAnswers = { updateVaultState: [], ...answers }

    runner.on(leverageStrategyContract, { ...strategyAnswers, upgradeProxy: [] })
    runner.on(leverageStrategyV2Contract, strategyAnswers)

    graphql.mock<LeverageStrategyDataQueryPayload>({
      name: 'LeverageStrategyData',
      data: { leverageStrategyPositions: positions },
    })
    graphql.mockHarvestParams({ canHarvest })

    return leverageStrategyV2Contract
  }
)


export default mockLeverageStrategy
