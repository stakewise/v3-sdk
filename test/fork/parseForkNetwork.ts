import { forkNetworks, getForkNetworkName } from './constants'
import type { ForkNetwork } from './constants'


const supportedNetworks = Object.keys(forkNetworks).map(Number) as ForkNetwork[]

export const forkNetworkNames = supportedNetworks.map(getForkNetworkName)

const parseForkNetwork = (name: string) => {
  const network = supportedNetworks.find((item) => getForkNetworkName(item) === name)

  if (!network) {
    throw new Error(`Unknown network "${name}", expected one of: ${forkNetworkNames.join(', ')}`)
  }

  return network
}


export default parseForkNetwork
