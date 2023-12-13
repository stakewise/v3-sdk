import type { Provider } from 'ethers'

import {
  Erc20Abi,
  VaultAbi,
  KeeperAbi,
  UsdRateAbi,
  MintTokenAbi,
  MulticallAbi,
  UniswapPoolAbi,
  PriceOracleAbi,
  PrivateVaultAbi,
  VaultFactoryAbi,
  VestingEscrowAbi,
  V2RewardTokenAbi,
  VaultsRegistryAbi,
  RewardSplitterAbi,
  MintTokenConfigAbi,
  MintTokenControllerAbi,
  VestingEscrowFactoryAbi,
  RewardSplitterFactoryAbi,
  UniswapPositionManagerAbi,
} from './abis'

import type {
  UniswapPositionManagerAbi as UniswapPositionManagerType,
  RewardSplitterFactoryAbi as RewardSplitterFactoryType,
  VestingEscrowFactoryAbi as VestingEscrowFactoryType,
  MintTokenControllerAbi as MintTokenControllerType,
  MintTokenConfigAbi as MintTokenConfigType,
  VaultsRegistryAbi as VaultsRegistryType,
  RewardSplitterAbi as RewardSplitterType,
  V2RewardTokenAbi as V2RewardTokenType,
  VestingEscrowAbi as VestingEscrowType,
  VaultFactoryAbi as VaultFactoryType,
  PrivateVaultAbi as PrivateVaultType,
  PriceOracleAbi as PriceOracleType,
  UniswapPoolAbi as UniswapPoolType,
  MulticallAbi as MulticallType,
  MintTokenAbi as MintTokenType,
  UsdRateAbi as UsdRateType,
  VaultAbi as VaultAbiType,
  KeeperAbi as KeeperType,
  Erc20Abi as Erc20Type,
} from './types'

import multicall from './multicall'
import createContract from './createContract'


const getSwiseToken = (provider: Provider, config: StakeWise.Config) => createContract<Erc20Type>(
  config.addresses.tokens.swise,
  Erc20Abi,
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

const getMintTokenController = (provider: Provider, config: StakeWise.Config) => createContract<MintTokenControllerType>(
  config.addresses.base.mintTokenController,
  MintTokenControllerAbi,
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
      createVault: (address: string) => createContract<VaultAbiType>(address, VaultAbi, provider),
      createUniswapPool: (address: string) => createContract<UniswapPoolType>(address, UniswapPoolAbi, provider),
      createPrivateVault: (address: string) => createContract<PrivateVaultType>(address, PrivateVaultAbi, provider),
      createRewardSplitter: (address: string) => createContract<RewardSplitterType>(address, RewardSplitterAbi, provider),
      createVestingEscrowDirect: (address: string) => createContract<VestingEscrowType>(address, VestingEscrowAbi, provider),
      createUsdRate: (address: string, _provider?: Provider) => createContract<UsdRateType>(address, UsdRateAbi, _provider || provider),
      createVestingEscrowFactory: (address: string) => createContract<VestingEscrowFactoryType>(address, VestingEscrowFactoryAbi, provider),
    },
    base: {
      keeper: getKeeper(provider, config),
      priceOracle: getPriceOracle(provider, config),
      vaultsRegistry: getVaultsRegistry(provider, config),
      mintTokenConfig: getMintTokenConfig(provider, config),
      mintTokenController: getMintTokenController(provider, config),
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
