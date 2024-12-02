/* eslint-disable max-len */
import type { Provider } from 'ethers'

import {
  Erc20Abi,
  KeeperAbi,
  OraclesAbi,
  UsdRateAbi,
  MulticallAbi,
  PriceOracleAbi,
  VaultFactoryAbi,
  VestingEscrowAbi,
  EigenPodOwnerAbi,
  V2RewardTokenAbi,
  VaultsRegistryAbi,
  RewardSplitterAbi,
  StakeCalculatorAbi,
  LeverageStrategyAbi,
  MintTokenConfigV1Abi,
  MintTokenConfigV2Abi,
  MerkleDistributorAbi,
  MerkleDistributorV2Abi,
  DepositDataRegistryAbi,
  MintTokenControllerAbi,
  VestingEscrowFactoryAbi,
  RewardSplitterFactoryAbi,
} from './abis'

import commonMulticall from './multicall/commonMulticall'
import createContract from './createContract'
import { createVaultContract } from './vault'


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

const getMerkleDistributorV2 = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.MerkleDistributorV2>(
  config.addresses.base.merkleDistributorV2,
  MerkleDistributorV2Abi,
  provider
)

const getOracles = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.Oracles>(
  config.addresses.base.oracles,
  OraclesAbi,
  provider
)

const getStakeCalculator = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.StakeCalculator>(
  config.addresses.special.stakeCalculator,
  StakeCalculatorAbi,
  provider
)

const getLeverageStrategy = (provider: Provider, config: StakeWise.Config) => createContract<StakeWise.ABI.LeverageStrategy>(
  config.addresses.special.leverageStrategy,
  LeverageStrategyAbi,
  provider
)

type CreateContractsInput = {
  provider: Provider
  config: StakeWise.Config
}

export const createContracts = (input: CreateContractsInput) => {
  const { provider, config } = input

  const createVault = createVaultContract(provider)
  const multicallContract = getMulticall(provider, config)

  return {
    helpers: {
      createVault,
      multicallContract,
      createMulticall: commonMulticall(multicallContract as StakeWise.ABI.Multicall),
      createErc20: (address: string) => createContract<StakeWise.ABI.Erc20Token>(address, Erc20Abi, provider),
      createEigenPodOwner: (address: string) => createContract<StakeWise.ABI.EigenPodOwner>(address, EigenPodOwnerAbi, provider),
      createRewardSplitter: (address: string) => createContract<StakeWise.ABI.RewardSplitter>(address, RewardSplitterAbi, provider),
      createVestingEscrowDirect: (address: string) => createContract<StakeWise.ABI.VestingEscrow>(address, VestingEscrowAbi, provider),
      createUsdRate: (address: string, _provider?: Provider) => createContract<StakeWise.ABI.UsdRate>(address, UsdRateAbi, _provider || provider),
      createVestingEscrowFactory: (address: string) => createContract<StakeWise.ABI.VestingEscrowFactory>(address, VestingEscrowFactoryAbi, provider),
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
      merkleDistributorV2: getMerkleDistributorV2(provider, config),
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
    special: {
      stakeCalculator: getStakeCalculator(provider, config),
      leverageStrategy: getLeverageStrategy(provider, config),
    },
  }
}


export default createContracts
