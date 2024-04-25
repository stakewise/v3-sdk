import methods from './methods'
import { configs, getGas, createProvider } from './utils'
import { createContracts, vaultMulticall } from './contracts'


type VaultMulticallInput = Pick<Parameters<typeof vaultMulticall>[0], 'request' | 'userAddress' | 'vaultAddress'>

class StakeWiseSDK {
  readonly utils: StakeWise.Utils
  readonly config: StakeWise.Config
  readonly options: StakeWise.Options
  readonly provider: StakeWise.Provider
  readonly vault: StakeWise.VaultMethods
  readonly contracts: StakeWise.Contracts
  readonly osToken: StakeWise.OsTokenMethods

  constructor(options: StakeWise.Options) {
    const config = configs[options.network]

    const provider = options.provider || createProvider({
      urls: options.endpoints?.web3 || '',
      network: options.network,
    })

    const contracts = createContracts({ provider, config })

    this.config = config
    this.options = options
    this.provider = provider
    this.contracts = contracts

    const argsForMethods = { options, contracts, provider }

    this.utils = methods.createUtils(argsForMethods)
    this.vault = methods.createVaultMethods(argsForMethods)
    this.osToken = methods.createOsTokenMethods(argsForMethods)
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
