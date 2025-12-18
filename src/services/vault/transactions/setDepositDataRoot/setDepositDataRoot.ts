import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { SetDepositDataRootInput } from './types'
import { handleContractError } from '../../../../helpers'
import getVaultVersion from '../../requests/getVaultVersion'


const setDepositDataRoot = checkAccess<string>(async (values: SetDepositDataRootInput) => {
  const { provider, userAddress, vaultAddress, depositDataRoot, contracts, options } = values

  const signer = await provider.getSigner(userAddress)

  const { isV1Version } = await getVaultVersion(values)

  if (isV1Version) {
    const vaultContract = contracts.helpers.createVault({
      vaultAddress,
      options: {
        chainId: options.network,
      },
    })

    const signedVaultContract = vaultContract.connect(signer)

    const result = await handleContractError(
      signedVaultContract.setValidatorsRoot(depositDataRoot),
      'transaction'
    )

    return result.hash
  }

  const contract = commonLogic(values)
  const signedDepositDataRegistryContract = contract.connect(signer)

  const result = await handleContractError(
    signedDepositDataRegistryContract.setDepositDataRoot(vaultAddress, depositDataRoot),
    'transaction'
  )

  return result?.hash
})


export default setDepositDataRoot
