import { afterAll, beforeAll } from 'vitest'
import { JsonRpcProvider, JsonRpcSigner, parseEther, toQuantity } from 'ethers'

import StakeWiseSDK from '../../src/StakeWiseSDK'
import { Network } from '../../src/helpers'

import { userAddress } from '../constants'

import { forkRpcUrl } from './constants'


class ForkProvider extends JsonRpcProvider {
  async getSigner(address?: number | string): Promise<JsonRpcSigner> {
    if (typeof address === 'string') {
      return new JsonRpcSigner(this, address)
    }

    return super.getSigner(address)
  }
}

const useForkSdk = () => {
  const provider = new ForkProvider(forkRpcUrl, Network.Mainnet, {
    cacheTimeout: -1,
    staticNetwork: true,
    pollingInterval: 100,
  })

  const sdk = new StakeWiseSDK({
    network: Network.Mainnet,
    provider,
    endpoints: { web3: forkRpcUrl },
  })

  let snapshotId = ''

  beforeAll(async () => {
    snapshotId = await provider.send('evm_snapshot', [])

    await provider.send('anvil_setBalance', [ userAddress, toQuantity(parseEther('10')) ])
  })

  afterAll(async () => {
    const isReverted = await provider.send('evm_revert', [ snapshotId ])

    if (!isReverted) {
      throw new Error(`anvil could not revert to the snapshot ${snapshotId}`)
    }
  })

  return { sdk, provider }
}


export default useForkSdk
