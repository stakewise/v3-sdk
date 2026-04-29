import type { AssertCancellable } from '../modules/gql-module'

import Vault from './vault'
import Boost from './boost'
import Utils from './utils'
import OsToken from './osToken'
import RewardSplitter from './rewardSplitter'
import VaultTransactions from './vault/transactions'
import BoostTransactions from './boost/transactions'
import DistributorRewards from './distributorRewards'
import OsTokenTransactions from './osToken/transactions'
import RewardSplitterTransactions from './rewardSplitter/transactions'
import DistributorRewardsTransactions from './distributorRewards/transactions'


// Requests methods must be cancellable according to docs
type Requests<T, Excluded extends keyof T = never> = Pick<T, Exclude<keyof T, Excluded | 'params'>>

// Wallet signing cannot be aborted, gas estimation is part of tx send
type UtilsTxHelpers = 'getVaultMulticallGas' | 'getVaultMulticallEncode' | 'getPermitSignature'

const assertCancellable: {
  utils: AssertCancellable<Requests<Utils, UtilsTxHelpers>>
  vault: AssertCancellable<Requests<Vault, keyof VaultTransactions>>
  boost: AssertCancellable<Requests<Boost, keyof BoostTransactions>>
  osToken: AssertCancellable<Requests<OsToken, keyof OsTokenTransactions>>
  rewardSplitter: AssertCancellable<Requests<RewardSplitter, keyof RewardSplitterTransactions>>
  distributorRewards: AssertCancellable<Requests<DistributorRewards, keyof DistributorRewardsTransactions>>
} = {
  utils: {} as Requests<Utils, UtilsTxHelpers>,
  vault: {} as Requests<Vault, keyof VaultTransactions>,
  boost: {} as Requests<Boost, keyof BoostTransactions>,
  osToken: {} as Requests<OsToken, keyof OsTokenTransactions>,
  rewardSplitter: {} as Requests<RewardSplitter, keyof RewardSplitterTransactions>,
  distributorRewards: {} as Requests<DistributorRewards, keyof DistributorRewardsTransactions>,
}
