import type { BrowserProvider, JsonRpcProvider, FallbackProvider } from 'ethers'

import methods from '../methods'
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
    type Provider = BrowserProvider | JsonRpcProvider | CustomFallbackProvider

    type Contracts = ReturnType<typeof createContracts>
    type Utils = ReturnType<typeof methods.createUtils>
    type VaultMethods = ReturnType<typeof methods.createVaultMethods>
    type BoostMethods = ReturnType<typeof methods.createBoostMethods>
    type OsTokenMethods = ReturnType<typeof methods.createOsTokenMethods>
    type RewardSplitterMethods = ReturnType<typeof methods.createRewardSplitterMethods>
    type DistributorRewardsMethods = ReturnType<typeof methods.createDistributorRewardsMethods>

    // FallbackProvider has no base methods unlike JsonRpcProvider
    type CustomFallbackProvider = FallbackProvider & {
      getSigner: () => any
      send: () => any
    }

    type UrlWithHeaders = {
      url: string
      headers: Record<string, string>
    }

    type Web3Endpoints = string | string[] | UrlWithHeaders[]

    type Options = {
      network: Network
      provider?: Provider
      endpoints?: {
        api?: string
        subgraph?: string | ReadonlyArray<string>
        web3?: Web3Endpoints
      }
    }

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
