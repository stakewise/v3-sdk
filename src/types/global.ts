import type { BrowserProvider, JsonRpcProvider, FallbackProvider } from 'ethers'

import methods from '../methods'
import { Network, configs } from '../utils'
import { createContracts } from '../contracts'

import type {
  VaultAbi as InitialVaultAbi,
  Erc20Abi,
  KeeperAbi,
  OraclesAbi,
  UsdRateAbi,
  MulticallAbi,
  PriceOracleAbi,
  UniswapPoolAbi,
  VaultFactoryAbi,
  V2RewardTokenAbi,
  EigenPodOwnerAbi,
  VestingEscrowAbi,
  VaultsRegistryAbi,
  RewardSplitterAbi,
  GnosisVaultDiffAbi,
  OtherTokenVaultAbi,
  StakeCalculatorAbi,
  GenesisVaultDiffAbi,
  PrivateVaultDiffAbi,
  MerkleDistributorAbi,
  MintTokenConfigV1Abi,
  MintTokenConfigV2Abi,
  RestakingVaultDiffAbi,
  BlocklistVaultDiffAbi,
  DepositDataRegistryAbi,
  MintTokenControllerAbi,
  VestingEscrowFactoryAbi,
  RewardSplitterFactoryAbi,
  UniswapPositionManagerAbi,
} from '../contracts/types'

type VaultAbi = InitialVaultAbi & GnosisVaultDiffAbi

declare global {

  namespace StakeWise {
    type Config = typeof configs[Network]
    type Provider = BrowserProvider | JsonRpcProvider | CustomFallbackProvider

    type Contracts = ReturnType<typeof createContracts>
    type Utils = ReturnType<typeof methods.createUtils>
    type VaultMethods = ReturnType<typeof methods.createVaultMethods>
    type OsTokenMethods = ReturnType<typeof methods.createOsTokenMethods>
    type RewardSplitterMethods = ReturnType<typeof methods.createRewardSplitterMethods>

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
      type Vault = VaultAbi
      type Keeper = KeeperAbi
      type Oracles = OraclesAbi
      type UsdRate = UsdRateAbi
      type MintToken = Erc20Abi
      type Erc20Token = Erc20Abi
      type Multicall = MulticallAbi
      type UniswapPool = UniswapPoolAbi
      type PriceOracle = PriceOracleAbi
      type VaultFactory = VaultFactoryAbi
      type EigenPodOwner = EigenPodOwnerAbi
      type V2RewardToken = V2RewardTokenAbi
      type VestingEscrow = VestingEscrowAbi
      type GenesisVault = GenesisVaultDiffAbi
      type RewardSplitter = RewardSplitterAbi
      type VaultsRegistry = VaultsRegistryAbi
      type StakeCalculator = StakeCalculatorAbi
      type OtherTokenVault = OtherTokenVaultAbi
      type MerkleDistributor = MerkleDistributorAbi
      type MintTokenConfigV1 = MintTokenConfigV1Abi
      type MintTokenConfigV2 = MintTokenConfigV2Abi
      type DepositDataRegistry = DepositDataRegistryAbi
      type MintTokenController = MintTokenControllerAbi
      type PrivateVault = VaultAbi & PrivateVaultDiffAbi
      type VestingEscrowFactory = VestingEscrowFactoryAbi
      type RewardSplitterFactory = RewardSplitterFactoryAbi
      type RestakingVault = RestakingVaultDiffAbi & VaultAbi
      type BlocklistVault = VaultAbi & BlocklistVaultDiffAbi
      type UniswapPositionManager = UniswapPositionManagerAbi
    }
  }
}
