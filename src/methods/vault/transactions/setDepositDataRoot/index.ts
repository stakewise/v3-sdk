import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { SetDepositDataRoot } from './types'
import setDepositDataRootGas from './setDepositDataRootGas'
import setDepositDataRootEncode from './setDepositDataRootEncode'

import { getVaultVersion } from '../../../../utils'


const setDepositDataRoot: SetDepositDataRoot = checkAccess<string>(async (values) => {
  const { provider, userAddress, vaultAddress, depositDataRoot, contracts, options } = values

  const signer = await provider.getSigner(userAddress)

  const { isV1Version } = await getVaultVersion({ vaultAddress, contracts })

  if (isV1Version) {
    const vaultContract = contracts.helpers.createVault({
      vaultAddress,
      options: {
        chainId: options.network,
      },
    })

    const signedVaultContract = vaultContract.connect(signer)
    const result = await signedVaultContract.setValidatorsRoot(depositDataRoot)

    return result.hash
  }

  const contract = commonLogic(values)
  const signedDepositDataRegistryContract = contract.connect(signer)

  const result = await signedDepositDataRegistryContract.setDepositDataRoot(vaultAddress, depositDataRoot)

  return result?.hash
}) as SetDepositDataRoot

setDepositDataRoot.encode = checkAccess<StakeWise.TransactionData>(setDepositDataRootEncode)
setDepositDataRoot.estimateGas = checkAccess<bigint>(setDepositDataRootGas)


export default setDepositDataRoot
