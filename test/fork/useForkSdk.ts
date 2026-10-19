import { beforeAll } from 'vitest'
import { parseEther, toQuantity } from 'ethers'
import type { JsonRpcProvider } from 'ethers'

import type StakeWiseSDK from '../../src/StakeWiseSDK'

import { userAddress } from '../constants'

import useSnapshot from './useSnapshot'
import createForkSdk from './createForkSdk'


type Output = {
  sdk: StakeWiseSDK
  provider: JsonRpcProvider
}

const useForkSdk = (): Output => {
  const { sdk, provider } = createForkSdk()

  useSnapshot(provider)

  beforeAll(async () => {
    await provider.send('anvil_setBalance', [ userAddress, toQuantity(parseEther('10')) ])
  })

  return { sdk, provider }
}


export default useForkSdk
