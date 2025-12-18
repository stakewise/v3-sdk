import type { UpgradeLeverageStrategyInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'
import { commonLogic } from './common'


const upgradeLeverageStrategy = async (values: UpgradeLeverageStrategyInput) => {
  const { provider, userAddress, vaultAddress } = values

  const leverageStrategyContract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = leverageStrategyContract.connect(signer)

  const result = await wrapErrorHandler(
    signedContract.upgradeProxy(vaultAddress),
    'transaction'
  )

  return result.hash
}


export default upgradeLeverageStrategy
