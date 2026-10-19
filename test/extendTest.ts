import { test } from 'vitest'

import createMockRunner from './mockRunner'
import {
  sdk,
  clock,
  graphql,
  gnosisSdk,
  multicall,
  transaction,
  vaultContract,
  mockMaxExitShares,
  mockOsTokenPosition,
  signedVaultContract,
  mockLeverageStrategy,
  mockSubVaultsRegistry,
  getPositionDataFromMock,
} from './fixtures'


const extendTest = test
  .extend('runner', createMockRunner)
  .extend('sdk', sdk)
  .extend('clock', clock)
  .extend('graphql', graphql)
  .extend('gnosisSdk', gnosisSdk)
  .extend('multicall', multicall)
  .extend('transaction', transaction)
  .extend('vaultContract', vaultContract)
  .extend('mockOsTokenPosition', mockOsTokenPosition)
  .extend('mockMaxExitShares', mockMaxExitShares)
  .extend('signedVaultContract', signedVaultContract)
  .extend('mockLeverageStrategy', mockLeverageStrategy)
  .extend('mockSubVaultsRegistry', mockSubVaultsRegistry)
  .extend('getPositionDataFromMock', getPositionDataFromMock)


export default extendTest
