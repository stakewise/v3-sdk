import type { Provider } from 'ethers'

import {
  Erc20Abi,
  VaultAbi,
  KeeperAbi,
  UsdRateAbi,
  MintTokenAbi,
  MulticallAbi,
  Erc20VaultAbi,
  SwiseTokenAbi,
  UniswapPoolAbi,
  PriceOracleAbi,
  PrivateVaultAbi,
  VaultFactoryAbi,
  V2RewardTokenAbi,
  VaultsRegistryAbi,
  RewardSplitterAbi,
  MintTokenConfigAbi,
  Erc20PrivateVaultAbi,
  RewardSplitterFactoryAbi,
  UniswapPositionManagerAbi,
} from './abis'

import type {
  UniswapPositionManagerAbi as UniswapPositionManagerType,
  RewardSplitterFactoryAbi as RewardSplitterFactoryType,
  MintTokenConfigAbi as MintTokenConfigType,
  VaultsRegistryAbi as VaultsRegistryType,
  RewardSplitterAbi as RewardSplitterType,
  V2RewardTokenAbi as V2RewardTokenType,
  VaultFactoryAbi as VaultFactoryType,
  PrivateVaultAbi as PrivateVaultType,
  Erc20VaultAbi as Erc20VaultAbiType,
  PriceOracleAbi as PriceOracleType,
  UniswapPoolAbi as UniswapPoolType,
  SwiseTokenAbi as SwiseTokenType,
  MulticallAbi as MulticallType,
  MintTokenAbi as MintTokenType,
  UsdRateAbi as UsdRateType,
  VaultAbi as VaultAbiType,
  KeeperAbi as KeeperType,
  Erc20Abi as Erc20Type,
} from './types'

import multicall from './multicall'
import createContract from './createContract'


const getSwiseToken = (provider: Provider, config: StakeWise.Config) => createContract<SwiseTokenType>(
  config.addresses.tokens.swise,
  SwiseTokenAbi,
  provider
)

const getMulticall = (provider: Provider, config: StakeWise.Config) => createContract<MulticallType>(
  config.addresses.base.multicall,
  MulticallAbi,
  provider
)

const getVaultFactory = (provider: Provider, address: string) => createContract<VaultFactoryType>(
  address,
  VaultFactoryAbi,
  provider
)

const getVaultsRegistry = (provider: Provider, config: StakeWise.Config) => createContract<VaultsRegistryType>(
  config.addresses.base.vaultsRegistry,
  VaultsRegistryAbi,
  provider
)

const getRewardSplitterFactory = (provider: Provider, config: StakeWise.Config) => createContract<RewardSplitterFactoryType>(
  config.addresses.base.rewardSplitterFactory,
  RewardSplitterFactoryAbi,
  provider
)

const getKeeper = (provider: Provider, config: StakeWise.Config) => createContract<KeeperType>(
  config.addresses.base.keeper,
  KeeperAbi,
  provider
)

const getMintToken = (provider: Provider, config: StakeWise.Config) => createContract<MintTokenType>(
  config.addresses.tokens.mintToken,
  MintTokenAbi,
  provider
)

const getMintTokenConfig = (provider: Provider, config: StakeWise.Config) => createContract<MintTokenConfigType>(
  config.addresses.base.mintTokenConfig,
  MintTokenConfigAbi,
  provider
)

const getPriceOracle = (provider: Provider, config: StakeWise.Config) => createContract<PriceOracleType>(
  config.addresses.base.priceOracle,
  PriceOracleAbi,
  provider
)

const getV2RewardToken = (provider: Provider, config: StakeWise.Config) => createContract<V2RewardTokenType>(
  config.addresses.tokens.v2RewardToken,
  V2RewardTokenAbi,
  provider
)

const getUniswapPositionManager = (provider: Provider, config: StakeWise.Config) => createContract<UniswapPositionManagerType>(
  config.addresses.uniswap.positionManager,
  UniswapPositionManagerAbi,
  provider
)

type CreateContractsInput = {
  provider: Provider
  config: StakeWise.Config
}

export const createContracts = (input: CreateContractsInput) => {
  const { provider, config } = input

  const multicallContract = getMulticall(provider, config)

  return {
    helpers: {
      multicallContract,
      createMulticall: multicall(multicallContract as MulticallType),
      createErc20: (address: string) => createContract<Erc20Type>(address, Erc20Abi, provider),
      createVaultContract: (address: string) => createContract<VaultAbiType>(address, VaultAbi, provider),
      createUniswapPoolAbi: (address: string) => createContract<UniswapPoolType>(address, UniswapPoolAbi, provider),
      createUsdRateContract: (address: string) => createContract<UsdRateType>(address, UsdRateAbi, provider),
      createErc20VaultContract: (address: string) => createContract<Erc20VaultAbiType>(address, Erc20VaultAbi, provider),
      createPrivateVaultContract: (address: string) => createContract<PrivateVaultType>(address, PrivateVaultAbi, provider),
      createRewardSplitterContract: (address: string) => createContract<RewardSplitterType>(address, RewardSplitterAbi, provider),
      createErc20PrivateVaultContract: (address: string) => createContract<PrivateVaultType>(address, Erc20PrivateVaultAbi, provider),
    },
    base: {
      keeper: getKeeper(provider, config),
      priceOracle: getPriceOracle(provider, config),
      vaultsRegistry: getVaultsRegistry(provider, config),
      mintTokenConfig: getMintTokenConfig(provider, config),
      rewardSplitterFactory: getRewardSplitterFactory(provider, config),
    },
    tokens: {
      mintToken: getMintToken(provider, config),
      swiseToken: getSwiseToken(provider, config),
      V2RewardToken: getV2RewardToken(provider, config),
    },
    factories: {
      vault: getVaultFactory(provider, config.addresses.factories.vault),
      erc20Vault: getVaultFactory(provider, config.addresses.factories.erc20Vault),
      privateVault: getVaultFactory(provider, config.addresses.factories.privateVault),
      erc20PrivateVault: getVaultFactory(provider, config.addresses.factories.erc20PrivateVault),
    },
    uniswap: {
      positionManager: getUniswapPositionManager(provider, config),
    },
  }
}


export default createContracts
