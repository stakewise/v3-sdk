import { JsonRpcProvider } from 'ethers'
import { configs, apiUrls } from 'helpers'
import { createContracts } from 'contracts'
import { createRequests, helpers } from 'requests'


class StakeWiseSDK {
  readonly requests: StakeWise.Requests
  readonly contracts: StakeWise.Contracts
  readonly helpers: typeof helpers = helpers

  constructor(options: StakeWise.Options) {
    const config = configs[options.network]
    const provider = options.provider || new JsonRpcProvider(apiUrls.getWeb3Url(options))

    this.contracts = createContracts({ provider, config })
    this.requests = createRequests({ options, contracts: this.contracts })
  }
}


export default StakeWiseSDK
