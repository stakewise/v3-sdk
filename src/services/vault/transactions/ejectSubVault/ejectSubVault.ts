import { commonLogic } from './common'
import { checkAccess } from '../util'
import type { EjectSubVaultInput } from './types'
import { sendWithGasMargin } from '../../../../helpers'


const ejectSubVault = checkAccess<EjectSubVaultInput>(async (values) => {
  const { provider, userAddress, subVaultAddress } = values

  const signer = await provider.getSigner(userAddress)

  const contract = await commonLogic(values)
  const signedContract = contract.connect(signer)

  const result = await sendWithGasMargin(signedContract.ejectSubVault, [ subVaultAddress ])

  return result?.hash
})


export default ejectSubVault
