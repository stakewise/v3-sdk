import { createContracts } from 'contracts'
import { Network, configs } from 'helpers'
import { createRequests } from 'requests'
import type { Provider } from 'ethers'


declare global {
  namespace StakeWise {
    type Config = typeof configs[Network]
    type Requests = ReturnType<typeof createRequests>
    type Contracts = ReturnType<typeof createContracts>

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
