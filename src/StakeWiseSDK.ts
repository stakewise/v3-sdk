import { configs } from 'helpers'
import { JsonRpcProvider } from 'ethers'
import { createRequests } from 'requests'
import { createContracts } from 'contracts'


class StakeWiseSDK {
  requests: Requests
  contracts: Contracts

  constructor(options: SDK.Options) {
    const { network, provider, endpoints } = options

    const config = configs[network]
    const library = provider || new JsonRpcProvider(endpoints?.web3 || config.network.url)

    this.requests = createRequests({ options })
    this.contracts = createContracts(library, config)
  }
}


export default StakeWiseSDK
