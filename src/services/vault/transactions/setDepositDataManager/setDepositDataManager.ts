import { commonLogic } from './common'
import { checkAccess } from '../util'
import type { SetDepositDataManagerInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'
import getVaultVersion from '../../requests/getVaultVersion'


const setDepositDataManager = checkAccess<SetDepositDataManagerInput>(async (values) => {
  const { provider, userAddress, managerAddress, vaultAddress, contracts } = values

  const signer = await provider.getSigner(userAddress)

  const { isV1Version } = await getVaultVersion(values)

  if (isV1Version) {
    const vaultContract = contracts.helpers.createVault({
      vaultAddress,
    })
    const signedContract = vaultContract.connect(signer)

    const result = await wrapErrorHandler(
      signedContract.setKeysManager(managerAddress),
      'transaction'
    )

    return result.hash
  }

  const contract = commonLogic(values)
  const signedContract = contract.connect(signer)

  const result = await wrapErrorHandler(
    signedContract.setDepositDataManager(vaultAddress, managerAddress),
    'transaction'
  )

  return result?.hash
})


export default setDepositDataManager
