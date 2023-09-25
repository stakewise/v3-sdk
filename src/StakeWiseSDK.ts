import { JsonRpcProvider } from 'ethers'
import { configs, apiUrls, Network } from 'helpers'
import { createRequests, getHealthFactor, getRewardsPerYear } from 'requests'
import { createContracts, createRatesContracts, vaultMulticall } from 'contracts'


type VaultMulticallInput = Pick<Parameters<typeof vaultMulticall>[0], 'request' | 'userAddress' | 'vaultAddress'>

class StakeWiseSDK {
  readonly options: StakeWise.Options
  readonly requests: StakeWise.Requests
  readonly contracts: StakeWise.Contracts
  readonly rateContracts: StakeWise.RateContracts

  constructor(options: StakeWise.Options) {
    const config = configs[options.network]
    const provider = options.provider || new JsonRpcProvider(apiUrls.getWeb3Url(options))

    this.options = options
    this.rateContracts = this.#initRateContracts()
    this.contracts = createContracts({ provider, config })
    this.requests = createRequests({ options, contracts: this.contracts })
  }

  #initRateContracts() {
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

  getHealthFactor = getHealthFactor
  getRewardsPerYear = getRewardsPerYear
}


export default StakeWiseSDK
