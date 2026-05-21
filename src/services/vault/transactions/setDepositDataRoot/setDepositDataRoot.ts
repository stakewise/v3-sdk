import { commonLogic } from './common'
import { checkAccess } from '../util'
import type { SetDepositDataRootInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'
import getVaultVersion from '../../requests/getVaultVersion'


const setDepositDataRoot = checkAccess<SetDepositDataRootInput>(
  async (values) => {
    const { provider, userAddress, vaultAddress, depositDataRoot, contracts } = values

    const signer = await provider.getSigner(userAddress)

    const { isV1Version } = await getVaultVersion(values)

    if (isV1Version) {
      const vaultContract = contracts.helpers.createVault({
        vaultAddress,
      })

      const signedVaultContract = vaultContract.connect(signer)

      const result = await wrapErrorHandler(
        signedVaultContract.setValidatorsRoot(depositDataRoot),
        'transaction'
      )

      return result.hash
    }

    const contract = commonLogic(values)
    const signedDepositDataRegistryContract = contract.connect(signer)

    const result = await wrapErrorHandler(
      signedDepositDataRegistryContract.setDepositDataRoot(vaultAddress, depositDataRoot),
      'transaction'
    )

    return result?.hash
  },
  [ 'depositDataManager' ]
)


export default setDepositDataRoot
