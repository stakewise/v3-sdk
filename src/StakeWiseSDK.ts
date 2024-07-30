import methods from './methods'
import { configs, getGas, createProvider, getVaultFactory, VaultType } from './utils'
import { createContracts, vaultMulticall, rewardSplitterMulticall } from './contracts'


type GetVaultFactoryInput = { vaultType: VaultType, isErc20?: boolean }
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

  getVaultFactory({ vaultType, isErc20 }: GetVaultFactoryInput) {
    return getVaultFactory({
      vaultType,
      isErc20,
      contracts: this.contracts,
    })
  }

  vaultMulticall<T extends unknown>({ userAddress, vaultAddress, request }: VaultMulticallInput) {
    return vaultMulticall<T>({
      vaultContract: this.contracts.helpers.createVault(vaultAddress),
      keeperContract: this.contracts.base.keeper,
      options: this.options,
      vaultAddress,
      userAddress,
      request,
    })
  }

  rewardSplitterMulticall<T extends unknown>(props: RewardSplitterMulticallInput) {
    const { userAddress, vaultAddress, rewardSplitterAddress, request } = props

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

  get network() {
    return this.options.network
  }
}


export default StakeWiseSDK
