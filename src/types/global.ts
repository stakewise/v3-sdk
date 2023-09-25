import { createContracts, createRatesContracts } from 'contracts'
import { Network, configs } from 'helpers'
import { createRequests } from 'requests'

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
  VestingEscrowAbi,
  V2RewardTokenAbi,
  VaultsRegistryAbi,
  RewardSplitterAbi,
  MintTokenConfigAbi,
  Erc20PrivateVaultAbi,
  VestingEscrowFactoryAbi,
  RewardSplitterFactoryAbi,
} from '../contracts/types'


declare global {

  namespace StakeWise {
    type Config = typeof configs[Network]
    type Requests = ReturnType<typeof createRequests>
    type Contracts = ReturnType<typeof createContracts>
    type RateContracts = ReturnType<typeof createRatesContracts>

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
      type VestingEscrow = VestingEscrowAbi
      type RewardSplitter = RewardSplitterAbi
      type VaultsRegistry = VaultsRegistryAbi
      type MintTokenConfig = MintTokenConfigAbi
      type Erc20PrivateVault = Erc20PrivateVaultAbi
      type VestingEscrowFactory = VestingEscrowFactoryAbi
      type RewardSplitterFactory = RewardSplitterFactoryAbi
    }
  }
}
