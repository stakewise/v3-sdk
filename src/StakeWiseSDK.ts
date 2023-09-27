import methods from 'methods'
import { JsonRpcProvider } from 'ethers'
import { configs, apiUrls, Network } from 'helpers'
import { createContracts, createRatesContracts, vaultMulticall } from 'contracts'


type VaultMulticallInput = Pick<Parameters<typeof vaultMulticall>[0], 'request' | 'userAddress' | 'vaultAddress'>

class StakeWiseSDK {
  readonly utils: StakeWise.Utils
  readonly options: StakeWise.Options
  readonly vault: StakeWise.VaultMethods
  readonly contracts: StakeWise.Contracts
  readonly osToken: StakeWise.OsTokenMethods
  readonly rateContracts: StakeWise.RateContracts

  constructor(options: StakeWise.Options) {
    const config = configs[options.network]
    const provider = options.provider || new JsonRpcProvider(apiUrls.getWeb3Url(options))

    this.options = options
    this.rateContracts = this.#initRateContracts()
    this.contracts = createContracts({ provider, config })

    const argsForMethods = { options, contracts: this.contracts }

    this.utils = methods.createUtils(argsForMethods)
    this.vault = methods.createVaultMethods(argsForMethods)
    this.osToken = methods.createOsTokenMethods(argsForMethods)
  }

  #initRateContracts() {
    // Contracts to get the exchange prices for tokens are on the mainnet
    const mainnetApiUrl = configs[Network.Mainnet].network.url
    const provider = new JsonRpcProvider(mainnetApiUrl)

    return createRatesContracts(provider)
  }

  vaultMulticall({ userAddress, vaultAddress, request }: VaultMulticallInput) {
    return vaultMulticall({
      vaultContract: this.contracts.helpers.createVaultContract(vaultAddress),
      keeperContract: this.contracts.base.keeper,
      options: this.options,
      vaultAddress,
      userAddress,
      request,
    })
  }
}


export default StakeWiseSDK
