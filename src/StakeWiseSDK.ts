import methods from './methods'

import { createContracts, vaultMulticall, rewardSplitterMulticall } from './contracts'

import {
  getGas,
  configs,
  VaultType,
  createProvider,
  getVaultFactory,
  getVaultVersion,
  getVaultContract,
} from './utils'


type GetVaultFactoryInput = { vaultType?: VaultType, isErc20?: boolean }
type VaultMulticallInput = Pick<Parameters<typeof vaultMulticall>[0], 'request' | 'userAddress' | 'vaultAddress'>
type RewardSplitterMulticallInput = Pick<Parameters<typeof rewardSplitterMulticall>[0], 'request' | 'userAddress' | 'vaultAddress'> & {
  rewardSplitterAddress: string
}

class StakeWiseSDK {
  readonly utils: StakeWise.Utils
  readonly config: StakeWise.Config
  readonly options: StakeWise.Options
  readonly provider: StakeWise.Provider
  readonly vault: StakeWise.VaultMethods
  readonly contracts: StakeWise.Contracts
  readonly osToken: StakeWise.OsTokenMethods
  readonly rewardSplitter: StakeWise.RewardSplitterMethods

  constructor(options: StakeWise.Options) {
    const config = configs[options.network]

    const provider = options.provider || createProvider(options)

    const contracts = createContracts({ provider, config })

    this.config = config
    this.options = options
    this.provider = provider
    this.contracts = contracts

    const argsForMethods = { options, contracts, provider }

    this.utils = methods.createUtils(argsForMethods)
    this.vault = methods.createVaultMethods(argsForMethods)
    this.osToken = methods.createOsTokenMethods(argsForMethods)
    this.rewardSplitter = methods.createRewardSplitterMethods(argsForMethods)
  }

  vaultMulticall<T extends unknown>(values: VaultMulticallInput) {
    const { userAddress, vaultAddress, request } = values

    const vaultContract = getVaultContract({
      contracts: this.contracts,
      network: this.network,
      vaultAddress,
    })

    return vaultMulticall<T>({
      keeperContract: this.contracts.base.keeper,
      options: this.options,
      vaultContract,
      vaultAddress,
      userAddress,
      request,
    })
  }

  getVaultFactory({ vaultType, isErc20 }: GetVaultFactoryInput) {
    return getVaultFactory({
      vaultType,
      isErc20,
      contracts: this.contracts,
    })
  }


  rewardSplitterMulticall<T extends unknown>(values: RewardSplitterMulticallInput) {
    const { userAddress, vaultAddress, rewardSplitterAddress, request } = values

    return rewardSplitterMulticall<T>({
      rewardSplitterContract: this.contracts.helpers.createRewardSplitter(rewardSplitterAddress),
      keeperContract: this.contracts.base.keeper,
      options: this.options,
      vaultAddress,
      userAddress,
      request,
    })
  }

  getGas(estimatedGas: bigint) {
    return getGas({
      provider: this.provider,
      estimatedGas,
    })
  }

  getVaultVersion(vaultAddress: string) {
    return getVaultVersion({
      contracts: this.contracts,
      vaultAddress,
    })
  }

  get network() {
    return this.options.network
  }
}


export default StakeWiseSDK
