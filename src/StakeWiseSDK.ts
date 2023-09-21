import { JsonRpcProvider } from 'ethers'
import { configs, apiUrls } from 'helpers'
import { createContracts } from 'contracts'
import { createRequests, getHealthFactor, getRewardsPerYear } from 'requests'


class StakeWiseSDK {
  readonly requests: StakeWise.Requests
  readonly contracts: StakeWise.Contracts

  constructor(options: StakeWise.Options) {
    const config = configs[options.network]
    const provider = options.provider || new JsonRpcProvider(apiUrls.getWeb3Url(options))

    this.contracts = createContracts({ provider, config })
    this.requests = createRequests({ options, contracts: this.contracts })
  }

  getHealthFactor = getHealthFactor
  getRewardsPerYear = getRewardsPerYear
}


export default StakeWiseSDK
