import { JsonRpcProvider } from 'ethers'
import { createRequests } from 'requests'
import { configs, apiUrls } from 'helpers'
import { createContracts } from 'contracts'


class StakeWiseSDK {
  readonly requests: SDK.Requests
  readonly contracts: SDK.Contracts

  constructor(options: SDK.Options) {
    const config = configs[options.network]
    const provider = options.provider || new JsonRpcProvider(apiUrls.getWeb3Url(options))

    this.contracts = createContracts({ provider, config })
    this.requests = createRequests({ options, contracts: this.contracts })
  }
}


export default StakeWiseSDK
