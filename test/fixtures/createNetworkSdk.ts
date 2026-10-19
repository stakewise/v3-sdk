import StakeWiseSDK from '../../src/StakeWiseSDK'
import type { Network } from '../../src/helpers'

import { rpcUrl } from '../constants'
import type { MockRunner } from '../mockRunner'


const createNetworkSdk = (network: Network, runner: MockRunner) => new StakeWiseSDK({
  network,
  provider: runner.provider,
  endpoints: { web3: rpcUrl },
})


export default createNetworkSdk
