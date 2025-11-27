import { Vault, Boost, RewardSplitter, DistributorRewards, OsToken, Utils } from './services'
import { configs, createProvider } from './helpers'
import { createContracts } from './contracts'


class StakeWiseSDK {
  readonly config: StakeWise.Config
  readonly options: StakeWise.Options
  readonly provider: StakeWise.Provider
  readonly contracts: StakeWise.Contracts

  readonly vault: StakeWise.Services.VaultService
  readonly utils: StakeWise.Services.UtilsService
  readonly boost: StakeWise.Services.BoostService
  readonly osToken: StakeWise.Services.OsTokenService
  readonly rewardSplitter: StakeWise.Services.RewardSplitterService
  readonly distributorRewards: StakeWise.Services.DistributorRewardsService

  constructor(options: StakeWise.Options) {
    const config = configs[options.network]

    if (!options.provider && !options.endpoints?.web3) {
      throw new Error('Provider or endpoints.web3 should be provided')
    }

    const provider = options.provider || createProvider(options)
    const originalGetSigner = provider.getSigner

    provider.getSigner = async function (address?: string) {
      const providerError = 'To send this transaction, please provide BrowserProvider to the StakeWiseSDK'

      try {
        const signer = await originalGetSigner.bind(this)(address)

        return signer
      }
      catch (error) {
        console.error('getSigner err:', error)
        throw new Error(providerError)
      }
    }

    const contracts = createContracts({ provider, config })

    this.config = config
    this.options = options
    this.provider = provider
    this.contracts = contracts

    if (options.endpoints?.subgraph) {
      // @ts-ignore: It's better to just overwrite
      this.config.api.subgraph = options.endpoints.subgraph
    }

    if (options.endpoints?.api) {
      // @ts-ignore: It's better to just overwrite
      this.config.api.backend = options.endpoints.api
    }

    const commonParams: StakeWise.CommonParams = {
      contracts,
      provider,
      options,
      config,
    }

    this.vault = new Vault(commonParams)
    this.utils = new Utils(commonParams)
    this.boost = new Boost(commonParams)
    this.osToken = new OsToken(commonParams)
    this.rewardSplitter = new RewardSplitter(commonParams)
    this.distributorRewards = new DistributorRewards(commonParams)
  }

  get network() {
    return this.options.network
  }
}


export default StakeWiseSDK
