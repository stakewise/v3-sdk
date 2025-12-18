import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { SetDepositDataManagerInput } from './types'
import { handleContractError } from '../../../../helpers'
import getVaultVersion from '../../requests/getVaultVersion'


const setDepositDataManager = checkAccess<string>(async (values: SetDepositDataManagerInput) => {
  const { provider, userAddress, managerAddress, vaultAddress, contracts, options } = values

  const signer = await provider.getSigner(userAddress)

  const { isV1Version } = await getVaultVersion(values)

  if (isV1Version) {
    const vaultContract = contracts.helpers.createVault({
      vaultAddress,
      options: {
        chainId: options.network,
      },
    })
    const signedContract = vaultContract.connect(signer)

    const result = await handleContractError(
      signedContract.setKeysManager(managerAddress),
      'transaction'
    )

    return result.hash
  }

  const contract = commonLogic(values)
  const signedContract = contract.connect(signer)

  const result = await handleContractError(
    signedContract.setDepositDataManager(vaultAddress, managerAddress),
    'transaction'
  )

  return result?.hash
})


export default setDepositDataManager
