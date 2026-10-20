import { Network } from '../../src/helpers/enums'


export type ForkNetwork = Network.Mainnet | Network.Gnosis

type ForkNetworkConfig = {
  port: number
  rpcEnv: 'MAINNET_RPC_URL' | 'GNOSIS_RPC_URL'
  computeUnitsPerSecond?: number
}

export const forkNetworks: Record<ForkNetwork, ForkNetworkConfig> = {
  [Network.Mainnet]: { port: 8545, rpcEnv: 'MAINNET_RPC_URL' },
  [Network.Gnosis]: { port: 8546, rpcEnv: 'GNOSIS_RPC_URL', computeUnitsPerSecond: 25 },
}

export const activeForkNetworks: ForkNetwork[] = [ Network.Mainnet, Network.Gnosis ]

export const getForkNetworkName = (network: ForkNetwork) => Network[network].toLowerCase()

export const forkNetworkCases = activeForkNetworks.map((network) => ({ network, name: getForkNetworkName(network) }))

export const getForkRpcUrl = (network: ForkNetwork) => `http://127.0.0.1:${forkNetworks[network].port}`
