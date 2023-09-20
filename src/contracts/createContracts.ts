import type { Provider } from 'ethers'

import {
  Erc20Abi,
  VaultAbi,
  KeeperAbi,
  MintTokenAbi,
  MulticallAbi,
  Erc20VaultAbi,
  SwiseTokenAbi,
  PriceOracleAbi,
  PrivateVaultAbi,
  VaultFactoryAbi,
  VestingEscrowAbi,
  V2RewardTokenAbi,
  VaultsRegistryAbi,
  RewardSplitterAbi,
  MintTokenConfigAbi,
  Erc20PrivateVaultAbi,
  VestingEscrowFactoryAbi,
  RewardSplitterFactoryAbi,
} from './abis'

import type {
  RewardSplitterFactoryAbi as RewardSplitterFactoryType,
  VestingEscrowFactoryAbi as VestingEscrowFactoryType,
  MintTokenConfigAbi as MintTokenConfigType,
  VaultsRegistryAbi as VaultsRegistryType,
  RewardSplitterAbi as RewardSplitterType,
  V2RewardTokenAbi as V2RewardTokenType,
  VestingEscrowAbi as VestingEscrowType,
  VaultFactoryAbi as VaultFactoryType,
  PrivateVaultAbi as PrivateVaultType,
  Erc20VaultAbi as Erc20VaultAbiType,
  PriceOracleAbi as PriceOracleType,
  SwiseTokenAbi as SwiseTokenType,
  MulticallAbi as MulticallType,
  MintTokenAbi as MintTokenType,
  VaultAbi as VaultAbiType,
  KeeperAbi as KeeperType,
  Erc20Abi as Erc20Type,
} from './types'

import multicall from './multicall'
import vaultMulticall from './vaultMulticall'
import createContract from './createContract'


const getSwiseToken = (library: Provider, config: Config) => createContract<SwiseTokenType>(
  config.addresses.tokens.swise,
  SwiseTokenAbi,
  library
)

const getMulticall = (library: Provider, config: Config) => createContract<MulticallType>(
  config.addresses.base.multicall,
  MulticallAbi,
  library
)

const getVestingEscrowFactory = (library: Provider, config: Config) => createContract<VestingEscrowFactoryType>(
  config.addresses.factories.vestingEscrow,
  VestingEscrowFactoryAbi,
  library
)

const getVaultFactory = (library: Provider, address: string) => createContract<VaultFactoryType>(
  address,
  VaultFactoryAbi,
  library
)

const getVaultsRegistry = (library: Provider, config: Config) => createContract<VaultsRegistryType>(
  config.addresses.base.vaultsRegistry,
  VaultsRegistryAbi,
  library
)

const getRewardSplitterFactory = (library: Provider, config: Config) => createContract<RewardSplitterFactoryType>(
  config.addresses.base.rewardSplitterFactory,
  RewardSplitterFactoryAbi,
  library
)

const getKeeper = (library: Provider, config: Config) => createContract<KeeperType>(
  config.addresses.base.keeper,
  KeeperAbi,
  library
)

const getMintToken = (library: Provider, config: Config) => createContract<MintTokenType>(
  config.addresses.tokens.mintToken,
  MintTokenAbi,
  library
)

const getMintTokenConfig = (library: Provider, config: Config) => createContract<MintTokenConfigType>(
  config.addresses.base.mintTokenConfig,
  MintTokenConfigAbi,
  library
)

const getPriceOracle = (library: Provider, config: Config) => createContract<PriceOracleType>(
  config.addresses.base.priceOracle,
  PriceOracleAbi,
  library
)

const getV2RewardToken = (library: Provider, config: Config) => createContract<V2RewardTokenType>(
  config.addresses.tokens.v2RewardToken,
  V2RewardTokenAbi,
  library
)


export const createContracts = (library: Provider, config: Config) => {
  const multicallContract = getMulticall(library, config)

  return {
    helpers: {
      multicallContract,
      createErc20: (address: string) => createContract<Erc20Type>(address, Erc20Abi, library),
      createVaultContract: (address: string) => createContract<VaultAbiType>(address, VaultAbi, library),
      createErc20VaultContract: (address: string) => createContract<Erc20VaultAbiType>(address, Erc20VaultAbi, library),
      createVestingEscrowDirect: (address: string) => createContract<VestingEscrowType>(address, VestingEscrowAbi, library),
      createPrivateVaultContract: (address: string) => createContract<PrivateVaultType>(address, PrivateVaultAbi, library),
      createRewardSplitterContract: (address: string) => createContract<RewardSplitterType>(address, RewardSplitterAbi, library),
      createErc20PrivateVaultContract: (address: string) => createContract<PrivateVaultType>(address, Erc20PrivateVaultAbi, library),
    },
    base: {
      keeper: getKeeper(library, config),
      priceOracle: getPriceOracle(library, config),
      vaultsRegistry: getVaultsRegistry(library, config),
      mintTokenConfig: getMintTokenConfig(library, config),
      rewardSplitterFactory: getRewardSplitterFactory(library, config),
    },
    tokens: {
      mintToken: getMintToken(library, config),
      swiseToken: getSwiseToken(library, config),
      V2RewardToken: getV2RewardToken(library, config),
    },
    factories: {
      vestingEscrow: getVestingEscrowFactory(library, config),
      vault: getVaultFactory(library, config.addresses.factories.vault),
      erc20Vault: getVaultFactory(library, config.addresses.factories.erc20Vault),
      privateVault: getVaultFactory(library, config.addresses.factories.privateVault),
      erc20PrivateVault: getVaultFactory(library, config.addresses.factories.erc20PrivateVault),
    },
  }
}


export default createContracts
