import type { vi } from 'vitest'

import type StakeWiseSDK from '../../src/StakeWiseSDK'

import type { MockRunner } from '../mockRunner'

import type { GraphqlFixture } from './graphql'
import type { MulticallFixture } from './multicall'
import type { TransactionFixture } from './transaction'
import type { MockMaxExitSharesFixture } from './mockMaxExitShares'
import type { MockLeverageStrategyFixture } from './mockLeverageStrategy'
import type { MockOsTokenPositionFixture } from './mockOsTokenPosition'
import type { MockSubVaultsRegistryFixture } from './mockSubVaultsRegistry'
import type { GetPositionDataFromMockFixture } from './getPositionDataFromMock'


type Fixtures = {
  clock: typeof vi
  sdk: StakeWiseSDK
  runner: MockRunner
  gnosisSdk: StakeWiseSDK
  graphql: GraphqlFixture
  multicall: MulticallFixture
  transaction: TransactionFixture
  mockMaxExitShares: MockMaxExitSharesFixture
  mockLeverageStrategy: MockLeverageStrategyFixture
  signedVaultContract: Fixtures['vaultContract']
  mockOsTokenPosition: MockOsTokenPositionFixture
  mockSubVaultsRegistry: MockSubVaultsRegistryFixture
  getPositionDataFromMock: GetPositionDataFromMockFixture
  vaultContract: ReturnType<StakeWise.Contracts['helpers']['createVault']>
}

type Name = keyof Fixtures

export type FixtureMethod<T, K extends Name = never> = [K] extends [never]
  ? () => T
  : (values: Pick<Fixtures, K>) => T

export type Fixture<N extends Name, K extends Name = never> = FixtureMethod<Fixtures[N], K>

export type AsyncFixture<N extends Name, K extends Name = never> = FixtureMethod<Promise<Fixtures[N]>, K>
