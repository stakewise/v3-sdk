import { parseEther } from 'ethers'

import type { VaultOsTokenConfigQueryPayload } from '../../src/graphql/subgraph/vault'

import { mintedShares, osTokenRatePercent } from '../constants'

import type { Fixture } from './types'


export type OsTokenPositionInput = {
  ltvPercent?: bigint
  osTokenShares?: bigint
  avgRewardPerSecond?: bigint
}

export type MockOsTokenPositionFixture = (values?: OsTokenPositionInput) => void

type Dependencies = 'sdk' | 'runner' | 'graphql' | 'vaultContract'

const vaultLtvPercent = parseEther('0.9')

const osTokenConfigPayload = (ltvPercent: bigint): VaultOsTokenConfigQueryPayload => ({
  vault: {
    osTokenConfig: {
      ltvPercent: String(ltvPercent),
      liqThresholdPercent: '920000000000000000',
    },
  },
})

const mockOsTokenPosition: Fixture<'mockOsTokenPosition', Dependencies> = ({ sdk, runner, graphql, vaultContract }) => (
  (values: OsTokenPositionInput = {}) => {
    const {
      ltvPercent = vaultLtvPercent,
      osTokenShares = mintedShares,
      avgRewardPerSecond = 0n,
    } = values
    const mintTokenControllerContract = sdk.contracts.base.mintTokenController

    runner.on(vaultContract, { osTokenPositions: [ osTokenShares ] })
    runner.on(mintTokenControllerContract, {
      avgRewardPerSecond: [ avgRewardPerSecond ],
      convertToAssets: ([ shares ]) => [ shares * osTokenRatePercent / 100n ],
      convertToShares: ([ assets ]) => [ assets * 100n / osTokenRatePercent ],
    })

    graphql.mock<VaultOsTokenConfigQueryPayload>({
      name: 'VaultOsTokenConfig',
      data: osTokenConfigPayload(ltvPercent),
    })
  }
)


export default mockOsTokenPosition
