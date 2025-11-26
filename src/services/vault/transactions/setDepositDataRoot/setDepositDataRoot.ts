import { commonLogic } from './common'
import checkAccess from './checkAccess'
import { getVaultVersion } from '../../../../utils'
import type { SetDepositDataRootInput } from './types'


const setDepositDataRoot = checkAccess<string>(async (values: SetDepositDataRootInput) => {
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
})


export default setDepositDataRoot
