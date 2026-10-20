import { afterAll, afterEach, beforeAll } from 'vitest'
import { JsonRpcProvider, JsonRpcSigner } from 'ethers'
import type { TransactionReceipt } from 'ethers'

import StakeWiseSDK from '../../src/StakeWiseSDK'
import { Network } from '../../src/helpers'

import wait from '../wait'
import { userAddress } from '../constants'
import { resetGraphql, checkGraphqlRequests } from '../mockGraphql'

import fundAccount from './fundAccount'
import { getSnapshot } from './snapshots'
import { getForkRpcUrl } from './constants'
import type { ForkSnapshot } from './snapshots'
import type { ForkNetwork } from './constants'


const receiptTimeoutMs = 30_000

class ForkProvider extends JsonRpcProvider {
  async getSigner(address?: number | string): Promise<JsonRpcSigner> {
    if (typeof address === 'string') {
      return new JsonRpcSigner(this, address)
    }

    return super.getSigner(address)
  }

  async waitForTransaction(hash: string): Promise<TransactionReceipt | null> {
    const deadline = Date.now() + receiptTimeoutMs

    while (Date.now() < deadline) {
      const receipt = await this.getTransactionReceipt(hash)

      if (receipt) {
        return receipt
      }

      await wait(this.pollingInterval)
    }

    throw new Error(`anvil has no receipt for ${hash} after ${receiptTimeoutMs} ms`)
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

    await fundAccount(provider, userAddress)
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
