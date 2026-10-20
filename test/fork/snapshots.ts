import { Network } from '../../src/helpers/enums'

import type { HarvestParamsQueryPayload } from '../../src/graphql/subgraph/vault'

import gnosis from './mocks/gnosis.json'
import mainnet from './mocks/mainnet.json'
import type { ForkNetwork } from './constants'


export type ForkSnapshot = {
  block: number
  vaultAddress: string
  harvestParams: HarvestParamsQueryPayload['harvestParams']
}

export const snapshots: Record<ForkNetwork, ForkSnapshot> = {
  [Network.Mainnet]: mainnet,
  [Network.Gnosis]: gnosis,
}

export const getSnapshot = (network: ForkNetwork) => snapshots[network]
