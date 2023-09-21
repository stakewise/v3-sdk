import { JsonRpcProvider } from 'ethers'
import { createRequests } from 'requests'
import { configs, apiUrls } from 'helpers'
import { createContracts } from 'contracts'


class StakeWiseSDK {
  readonly requests: StakeWise.Requests
  readonly contracts: StakeWise.Contracts

  constructor(options: StakeWise.Options) {
    const config = configs[options.network]
    const provider = options.provider || new JsonRpcProvider(apiUrls.getWeb3Url(options))

    this.contracts = createContracts({ provider, config })
    this.requests = createRequests({ options, contracts: this.contracts })
  }
}


export default StakeWiseSDK
