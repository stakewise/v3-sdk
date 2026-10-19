import { userAddress } from '../constants'

import type { AsyncFixture } from './types'


type Wrapper = AsyncFixture<'signedVaultContract', 'runner' | 'vaultContract'>

const signedVaultContract: Wrapper = async ({ runner, vaultContract }) => {
  const signer = await runner.provider.getSigner(userAddress)

  runner.on(vaultContract, {
    setFeeRecipient: [],
    setFeePercent: [],
  })

  return vaultContract.connect(signer)
}


export default signedVaultContract
