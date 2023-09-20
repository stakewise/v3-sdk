import { createContracts } from 'contracts'
import { Network, configs } from 'helpers'
import { createRequests } from 'requests'
import type { Provider } from 'ethers'


declare global {
  type Config = typeof configs[Network]
  type Requests = ReturnType<typeof createRequests>
  type Contracts = ReturnType<typeof createContracts>

  namespace SDK {

    type Options = {
      network: Network
      provider?: Provider
      endpoints?: {
        api?: string
        web3?: string
        subgraph?: string
      },
    }
  }
}


export {}
