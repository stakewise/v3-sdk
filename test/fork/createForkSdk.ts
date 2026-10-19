import { JsonRpcProvider, JsonRpcSigner } from 'ethers'

import StakeWiseSDK from '../../src/StakeWiseSDK'
import { Network } from '../../src/helpers'

import { forkRpcUrl } from './constants'


class ForkProvider extends JsonRpcProvider {
  async getSigner(address?: number | string): Promise<JsonRpcSigner> {
    if (typeof address === 'string') {
      return new JsonRpcSigner(this, address)
    }

    return super.getSigner(address)
  }
}

const createForkSdk = () => {
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

  return { sdk, provider }
}


export default createForkSdk
