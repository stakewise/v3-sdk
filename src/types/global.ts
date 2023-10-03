import { createContracts, createRatesContracts } from 'contracts'
import { Network, configs } from 'helpers'
import methods from 'methods'

import type {
  VaultAbi,
  Erc20Abi,
  KeeperAbi,
  UsdRateAbi,
  EthRateAbi,
  MulticallAbi,
  MintTokenAbi,
  Erc20VaultAbi,
  SwiseTokenAbi,
  PriceOracleAbi,
  VaultFactoryAbi,
  PrivateVaultAbi,
  V2RewardTokenAbi,
  VaultsRegistryAbi,
  RewardSplitterAbi,
  MintTokenConfigAbi,
  Erc20PrivateVaultAbi,
  RewardSplitterFactoryAbi,
} from '../contracts/types'


declare global {

  namespace StakeWise {
    type Config = typeof configs[Network]
    type Contracts = ReturnType<typeof createContracts>
    type RateContracts = ReturnType<typeof createRatesContracts>

    type Utils = ReturnType<typeof methods.createUtils>
    type VaultMethods = ReturnType<typeof methods.createVaultMethods>
    type OsTokenMethods = ReturnType<typeof methods.createOsTokenMethods>

    type Options = {
      network: Network
      provider?: any
      endpoints?: {
        api?: string
        web3?: string
        subgraph?: string
      }
    }

    namespace ABI {
      type Vault = VaultAbi
      type Keeper = KeeperAbi
      type UsdRate = UsdRateAbi
      type EthRate = EthRateAbi
      type Erc20Token = Erc20Abi
      type Multicall = MulticallAbi
      type MintToken = MintTokenAbi
      type Erc20Vault = Erc20VaultAbi
      type SwiseToken = SwiseTokenAbi
      type PriceOracle = PriceOracleAbi
      type PrivateVault = PrivateVaultAbi
      type VaultFactory = VaultFactoryAbi
      type V2RewardToken = V2RewardTokenAbi
      type RewardSplitter = RewardSplitterAbi
      type VaultsRegistry = VaultsRegistryAbi
      type MintTokenConfig = MintTokenConfigAbi
      type Erc20PrivateVault = Erc20PrivateVaultAbi
      type RewardSplitterFactory = RewardSplitterFactoryAbi
    }
  }
}
