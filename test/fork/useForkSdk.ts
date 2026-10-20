import { afterAll, afterEach, beforeAll } from 'vitest'
import { JsonRpcProvider, JsonRpcSigner, parseEther, toQuantity } from 'ethers'

import StakeWiseSDK from '../../src/StakeWiseSDK'
import { Network } from '../../src/helpers'

import { userAddress } from '../constants'
import { resetGraphql, checkGraphqlRequests } from '../mockGraphql'

import { getSnapshot } from './snapshots'
import { getForkRpcUrl } from './constants'
import type { ForkSnapshot } from './snapshots'
import type { ForkNetwork } from './constants'


class ForkProvider extends JsonRpcProvider {
  async getSigner(address?: number | string): Promise<JsonRpcSigner> {
    if (typeof address === 'string') {
      return new JsonRpcSigner(this, address)
    }

    return super.getSigner(address)
  }
}

export type Fork = {
  sdk: StakeWiseSDK
  provider: ForkProvider
  network: ForkNetwork
  snapshot: ForkSnapshot
}

export type Setup = (fork: Fork) => Promise<unknown>

type Options = {
  network?: ForkNetwork
  setup?: Setup
}

const takeSnapshot = (provider: ForkProvider): Promise<string> => provider.send('evm_snapshot', [])

const revertSnapshot = async (provider: ForkProvider, snapshotId: string) => {
  const isReverted = await provider.send('evm_revert', [ snapshotId ])

  if (!isReverted) {
    throw new Error(`anvil could not revert to the snapshot ${snapshotId}`)
  }
}

const useForkSdk = (options: Options = {}): Fork => {
  const { network = Network.Mainnet, setup } = options

  const snapshot = getSnapshot(network)
  const forkRpcUrl = getForkRpcUrl(network)

  const provider = new ForkProvider(forkRpcUrl, network, {
    cacheTimeout: -1,
    staticNetwork: true,
    pollingInterval: 100,
  })

  const sdk = new StakeWiseSDK({
    network,
    provider,
    endpoints: { web3: forkRpcUrl },
  })

  const fork: Fork = {
    sdk,
    provider,
    network,
    snapshot,
  }

  let fileSnapshotId = ''
  let testSnapshotId = ''

  beforeAll(async () => {
    fileSnapshotId = await takeSnapshot(provider)

    resetGraphql()

    await provider.send('anvil_setBalance', [ userAddress, toQuantity(parseEther('10')) ])
    await setup?.(fork)

    checkGraphqlRequests()

    testSnapshotId = await takeSnapshot(provider)
  })

  afterEach(async () => {
    await revertSnapshot(provider, testSnapshotId)

    testSnapshotId = await takeSnapshot(provider)
  })

  afterAll(async () => {
    await revertSnapshot(provider, fileSnapshotId)
  })

  return fork
}


export default useForkSdk
