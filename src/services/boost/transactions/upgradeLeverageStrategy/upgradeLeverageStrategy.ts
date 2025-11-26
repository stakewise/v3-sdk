import type { UpgradeLeverageStrategyInput } from './types'
import { commonLogic } from './common'


const upgradeLeverageStrategy = async (values: UpgradeLeverageStrategyInput) => {
  const { provider, userAddress, vaultAddress } = values

  const leverageStrategyContract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = leverageStrategyContract.connect(signer)

  const result = await signedContract.upgradeProxy(vaultAddress)

  return result.hash
}


export default upgradeLeverageStrategy
