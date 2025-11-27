import type { BrowserProvider, JsonRpcProvider, FallbackProvider, JsonRpcSigner, TransactionResponse } from 'ethers'

import VaultInstance from '../services/vault'
import BoostInstance from '../services/boost'
import UtilsInstance from '../services/utils'
import OsTokenInstance from '../services/osToken'
import RewardSplitterInstance from '../services/rewardSplitter'
import DistributorRewardsInstance from '../services/distributorRewards'

import { Network, configs } from '../utils'
import { createContracts } from '../contracts'

import type {
  Erc20Abi,
  KeeperAbi,
  UsdRateAbi,
  MulticallAbi,
  PriceOracleAbi,
  VaultFactoryAbi,
  V2RewardTokenAbi,
  EigenPodOwnerAbi,
  VestingEscrowAbi,
  VaultsRegistryAbi,
  RewardSplitterAbi,
  StakeCalculatorAbi,
  LeverageStrategyAbi,
  MintTokenConfigV1Abi,
  MintTokenConfigV2Abi,
  DepositDataRegistryAbi,
  MerkleDistributorV2Abi,
  MintTokenControllerAbi,
  VestingEscrowFactoryAbi,
  RewardSplitterFactoryAbi,
} from '../contracts/types'


declare global {

  namespace StakeWise {
    type Config = typeof configs[Network]
    type Contracts = ReturnType<typeof createContracts>
    type Provider = BrowserProvider | JsonRpcProvider | CustomFallbackProvider

    type Options = {
      network: Network
      provider?: Provider
      endpoints?: {
        api?: string
        subgraph?: string | ReadonlyArray<string>
        web3?: Web3Endpoints
      }
    }

    namespace Services {
      type Vault = VaultInstance
      type Boost = BoostInstance
      type Utils = UtilsInstance
      type OsToken = OsTokenInstance
      type RewardSplitter = RewardSplitterInstance
      type DistributorRewards = DistributorRewardsInstance
    }

    type CommonParams = {
      config: StakeWise.Config
      options: StakeWise.Options
      provider: StakeWise.Provider
      contracts: StakeWise.Contracts
    }

    type ExtractInput<T> = Omit<T, keyof CommonParams>

    type AnyTxMethod = {
      (values: any): any
      encode(values: any): any
      estimateGas(values: any): any
    }

    type ExtractTxMethod<T extends AnyTxMethod> = {
      (values: StakeWise.ExtractInput<Parameters<T>[0]>): ReturnType<T>
      encode(values: StakeWise.ExtractInput<Parameters<T['encode']>[0]>): ReturnType<T['encode']>
      estimateGas(values: StakeWise.ExtractInput<Parameters<T['estimateGas']>[0]>): ReturnType<T['estimateGas']>
    }

    // FallbackProvider has no base methods unlike JsonRpcProvider
    type CustomFallbackProvider = FallbackProvider & {
      getSigner: () => Promise<JsonRpcSigner>
      send: () => Promise<TransactionResponse>
    }

    type UrlWithHeaders = {
      url: string
      headers: Record<string, string>
    }

    type Web3Endpoints = string | string[] | UrlWithHeaders[]

    type TransactionData = {
      data: string
      to: string
    }

    type TransactionHash = string

    namespace ABI {
      type Keeper = KeeperAbi
      type UsdRate = UsdRateAbi
      type MintToken = Erc20Abi
      type Erc20Token = Erc20Abi
      type Multicall = MulticallAbi
      type PriceOracle = PriceOracleAbi
      type VaultFactory = VaultFactoryAbi
      type EigenPodOwner = EigenPodOwnerAbi
      type V2RewardToken = V2RewardTokenAbi
      type VestingEscrow = VestingEscrowAbi
      type RewardSplitter = RewardSplitterAbi
      type VaultsRegistry = VaultsRegistryAbi
      type StakeCalculator = StakeCalculatorAbi
      type LeverageStrategy = LeverageStrategyAbi
      type MintTokenConfigV1 = MintTokenConfigV1Abi
      type MintTokenConfigV2 = MintTokenConfigV2Abi
      type DepositDataRegistry = DepositDataRegistryAbi
      type MerkleDistributorV2 = MerkleDistributorV2Abi
      type MintTokenController = MintTokenControllerAbi
      type VestingEscrowFactory = VestingEscrowFactoryAbi
      type RewardSplitterFactory = RewardSplitterFactoryAbi
    }
  }
}
