import { stakeAmount } from '../constants'

import type { Fixture } from './types'
import type { OsTokenPositionInput } from './mockOsTokenPosition'


export type MaxExitSharesInput = OsTokenPositionInput & {
  stakeShares?: bigint
}

export type MockMaxExitSharesFixture = (values: MaxExitSharesInput) => StakeWise.CommonParams

type Wrapper = Fixture<'mockMaxExitShares', 'sdk' | 'runner' | 'graphql' | 'vaultContract' | 'mockOsTokenPosition'>

const mockMaxExitShares: Wrapper = ({ sdk, runner, graphql, vaultContract, mockOsTokenPosition }) => (
  (values: MaxExitSharesInput) => {
    const { stakeShares = stakeAmount, ...position } = values

    mockOsTokenPosition(position)
    graphql.mockHarvestParams({ canHarvest: false })

    runner.on(vaultContract, {
      getShares: [ stakeShares ],
      convertToShares: ([ assets ]) => [ assets * 10n / 11n ],
    })

    return sdk.vault.params
  }
)


export default mockMaxExitShares
