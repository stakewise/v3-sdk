import type { UpgradeLeverageStrategyInput } from './types'
import { handleContractError } from '../../../../helpers'
import { commonLogic } from './common'


const upgradeLeverageStrategy = async (values: UpgradeLeverageStrategyInput) => {
  const { provider, userAddress, vaultAddress } = values

  const leverageStrategyContract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = leverageStrategyContract.connect(signer)

  const result = await handleContractError(
    signedContract.upgradeProxy(vaultAddress),
    'transaction'
  )

  return result.hash
}


export default upgradeLeverageStrategy
