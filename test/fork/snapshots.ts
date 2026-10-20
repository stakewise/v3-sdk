import { Network } from '../../src/helpers/enums'

import type { HarvestParamsQueryPayload } from '../../src/graphql/subgraph/vault'

import mainnet from './mocks/mainnet.json'
import { getForkNetworkName } from './constants'
import type { ForkNetwork } from './constants'


export type ForkSnapshot = {
  block: number
  vaultAddress: string
  harvestParams: HarvestParamsQueryPayload['harvestParams']
}

export const snapshots: Partial<Record<ForkNetwork, ForkSnapshot>> = {
  [Network.Mainnet]: mainnet,
}

export const getSnapshot = (network: ForkNetwork) => {
  const snapshot = snapshots[network]

  if (!snapshot) {
    const name = getForkNetworkName(network)

    throw new Error(`No fork snapshot for ${name} - add mocks/${name}.json to snapshots.ts`)
  }

  return snapshot
}
