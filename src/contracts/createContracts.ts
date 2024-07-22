/* eslint-disable max-len */
import type { Provider } from 'ethers'

import {
  Erc20Abi,
  VaultAbi,
  KeeperAbi,
  OraclesAbi,
  UsdRateAbi,
  MulticallAbi,
  UniswapPoolAbi,
  PriceOracleAbi,
  GenesisVaultAbi,
  PrivateVaultAbi,
  VaultFactoryAbi,
  VestingEscrowAbi,
  EigenPodOwnerAbi,
  V2RewardTokenAbi,
  BlocklistVaultAbi,
  VaultsRegistryAbi,
  RewardSplitterAbi,
  RestakingVaultAbi,
  StakeCalculatorAbi,
  OtherTokenVaultAbi,
  MintTokenConfigV1Abi,
  MintTokenConfigV2Abi,
  MerkleDistributorAbi,
  DepositDataRegistryAbi,
  MintTokenControllerAbi,
  VestingEscrowFactoryAbi,
  RewardSplitterFactoryAbi,
  UniswapPositionManagerAbi,
} from './abis'

import commonMulticall from './multicall/commonMulticall'
import createContract from './createContract'


const getSwiseToken = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.Erc20Token>(
  config.addresses.tokens.swise,
  Erc20Abi,
  provider
)

const getMulticall = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.Multicall>(
  config.addresses.base.multicall,
  MulticallAbi,
  provider
)

const getVaultFactory = (provider: Provider, address: string) => createContract<StakeWise.ABI.VaultFactory>(
  address,
  VaultFactoryAbi,
  provider
)

const getVaultsRegistry = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.VaultsRegistry>(
  config.addresses.base.vaultsRegistry,
  VaultsRegistryAbi,
  provider
)

const getRewardSplitterFactory = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.RewardSplitterFactory>(
  config.addresses.base.rewardSplitterFactory,
  RewardSplitterFactoryAbi,
  provider
)

const getKeeper = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.Keeper>(
  config.addresses.base.keeper,
  KeeperAbi,
  provider
)

const getMintToken = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.MintToken>(
  config.addresses.tokens.mintToken,
  Erc20Abi,
  provider
)

const getMintTokenConfigV1 = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.MintTokenConfigV1>(
  config.addresses.base.mintTokenConfigV1,
  MintTokenConfigV1Abi,
  provider
)

const getMintTokenConfigV2 = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.MintTokenConfigV2>(
  config.addresses.base.mintTokenConfigV2,
  MintTokenConfigV2Abi,
  provider
)

const getMintTokenController = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.MintTokenController>(
  config.addresses.base.mintTokenController,
  MintTokenControllerAbi,
  provider
)

const getPriceOracle = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.PriceOracle>(
  config.addresses.base.priceOracle,
  PriceOracleAbi,
  provider
)

const getV2RewardToken = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.V2RewardToken>(
  config.addresses.tokens.v2RewardToken,
  V2RewardTokenAbi,
  provider
)

const getUniswapPositionManager = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.UniswapPositionManager>(
  config.addresses.uniswap.positionManager,
  UniswapPositionManagerAbi,
  provider
)

const getDepositDataRegistry = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.DepositDataRegistry>(
  config.addresses.base.depositDataRegistry,
  DepositDataRegistryAbi,
  provider
)

const getMerkleDistributor = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.MerkleDistributor>(
  config.addresses.base.merkleDistributor,
  MerkleDistributorAbi,
  provider
)

const getOracles = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.Oracles>(
  config.addresses.base.oracles,
  OraclesAbi,
  provider
)

const getStakeCalculator = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.StakeCalculator>(
  config.addresses.helpers.stakeCalculator,
  StakeCalculatorAbi,
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
      stakeCalculator: getStakeCalculator(provider, config),

      createMulticall: commonMulticall(multicallContract as StakeWise.ABI.Multicall),
      createErc20: (address: string) => createContract<StakeWise.ABI.Erc20Token>(address, Erc20Abi, provider),
      createUniswapPool: (address: string) => createContract<StakeWise.ABI.UniswapPool>(address, UniswapPoolAbi, provider),
      createEigenPodOwner: (address: string) => createContract<StakeWise.ABI.EigenPodOwner>(address, EigenPodOwnerAbi, provider),
      createRewardSplitter: (address: string) => createContract<StakeWise.ABI.RewardSplitter>(address, RewardSplitterAbi, provider),
      createVestingEscrowDirect: (address: string) => createContract<StakeWise.ABI.VestingEscrow>(address, VestingEscrowAbi, provider),
      createUsdRate: (address: string, _provider?: Provider) => createContract<StakeWise.ABI.UsdRate>(address, UsdRateAbi, _provider || provider),
      createVestingEscrowFactory: (address: string) => createContract<StakeWise.ABI.VestingEscrowFactory>(address, VestingEscrowFactoryAbi, provider),

      // Vaults
      createVault: (address: string) => createContract<StakeWise.ABI.Vault>(address, VaultAbi, provider),
      createPrivateVault: (address: string) => createContract<StakeWise.ABI.PrivateVault>(address, PrivateVaultAbi, provider),
      createRestakingVault: (address: string) => createContract<StakeWise.ABI.RestakingVault>(address, RestakingVaultAbi, provider),
      createBlocklistedVault: (address: string) => createContract<StakeWise.ABI.BlocklistVault>(address, BlocklistVaultAbi, provider),
      createOtherTokenVault: (address: string) => createContract<StakeWise.ABI.OtherTokenVault>(address, OtherTokenVaultAbi, provider),
      createGenesisVault: (address: string) => createContract<StakeWise.ABI.GenesisVault & StakeWise.ABI.Vault>(address, GenesisVaultAbi, provider),
    },
    base: {
      keeper: getKeeper(provider, config),
      oracles: getOracles(provider, config),
      priceOracle: getPriceOracle(provider, config),
      vaultsRegistry: getVaultsRegistry(provider, config),
      mintTokenConfig: {
        v1: getMintTokenConfigV1(provider, config),
        v2: getMintTokenConfigV2(provider, config),
      },
      merkleDistributor: getMerkleDistributor(provider, config),
      depositDataRegistry: getDepositDataRegistry(provider, config),
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

      blocklistVault: getVaultFactory(provider, config.addresses.factories.blocklistVault),
      erc20BlocklistVault: getVaultFactory(provider, config.addresses.factories.erc20BlocklistVault),
    },
    uniswap: {
      positionManager: getUniswapPositionManager(provider, config),
    },
  }
}


export default createContracts
