import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { SetDepositDataManagerRoot } from './types'
import setDepositDataManagerGas from './setDepositDataManagerGas'
import setDepositDataManagerEncode from './setDepositDataManagerEncode'

import { getVaultVersion } from '../../../../utils'


const setDepositDataManager: SetDepositDataManagerRoot = async (values) => {
  const { provider, userAddress, managerAddress, vaultAddress, contracts, options } = values

  const { isV1Version } = await getVaultVersion({ vaultAddress, contracts })

  if (isV1Version) {
    const vaultContract = contracts.helpers.createVault({
      vaultAddress,
      options: {
        chainId: options.network,
      },
    })

    const signer = await provider.getSigner(userAddress)
    const signedVaultContract = vaultContract.connect(signer)

    const result = await signedVaultContract.setKeysManager(managerAddress)

    return result.hash
  }

  const contract = commonLogic(values)
  const signer = await provider.getSigner(userAddress)
  const signedDepositDataRegistryContract = contract.connect(signer)

  const result = await signedDepositDataRegistryContract.setDepositDataManager(vaultAddress, managerAddress)

  return result?.hash
}

setDepositDataManager.encode = checkAccess<StakeWise.TransactionData>(setDepositDataManagerEncode)
setDepositDataManager.estimateGas = checkAccess<bigint>(setDepositDataManagerGas)


export default checkAccess<string>(setDepositDataManager)
