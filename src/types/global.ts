import { BrowserProvider, JsonRpcProvider, FallbackProvider } from 'ethers'

import methods from '../methods'
import { Network, configs } from '../utils'
import { createContracts } from '../contracts'

import type {
  VaultAbi,
  Erc20Abi,
  KeeperAbi,
  UsdRateAbi,
  MulticallAbi,
  MintTokenAbi,
  PriceOracleAbi,
  UniswapPoolAbi,
  VaultFactoryAbi,
  V2RewardTokenAbi,
  VestingEscrowAbi,
  VaultsRegistryAbi,
  RewardSplitterAbi,
  MintTokenConfigAbi,
  OtherTokenVaultAbi,
  PrivateVaultDiffAbi,
  BlocklistVaultDiffAbi,
  DepositDataRegistryAbi,
  MintTokenControllerAbi,
  VestingEscrowFactoryAbi,
  RewardSplitterFactoryAbi,
  UniswapPositionManagerAbi,
} from '../contracts/types'


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

    type Options = {
      network: Network
      provider?: Provider
      endpoints?: {
        api?: string
        subgraph?: string
        web3?: string | string[]
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
      type UsdRate = UsdRateAbi
      type Erc20Token = Erc20Abi
      type Multicall = MulticallAbi
      type MintToken = Erc20Abi
      type UniswapPool = UniswapPoolAbi
      type PriceOracle = PriceOracleAbi
      type VaultFactory = VaultFactoryAbi
      type V2RewardToken = V2RewardTokenAbi
      type VestingEscrow = VestingEscrowAbi
      type RewardSplitter = RewardSplitterAbi
      type VaultsRegistry = VaultsRegistryAbi
      type MintTokenConfig = MintTokenConfigAbi
      type OtherTokenVault = OtherTokenVaultAbi
      type DepositDataRegistry = DepositDataRegistryAbi
      type MintTokenController = MintTokenControllerAbi
      type PrivateVault = VaultAbi & PrivateVaultDiffAbi
      type VestingEscrowFactory = VestingEscrowFactoryAbi
      type RewardSplitterFactory = RewardSplitterFactoryAbi
      type BlocklistVault = VaultAbi & BlocklistVaultDiffAbi
      type UniswapPositionManager = UniswapPositionManagerAbi
    }
  }
}
