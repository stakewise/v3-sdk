import upgradeLeverageStrategyGas from './upgradeLeverageStrategyGas'
import upgradeLeverageStrategyEncode from './upgradeLeverageStrategyEncode'
import type { UpgradeLeverageStrategy } from './types'
import { commonLogic } from './common'


const upgradeLeverageStrategy: UpgradeLeverageStrategy = async (values) => {
  const { provider, userAddress, vaultAddress } = values

  const leverageStrategyContract = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = leverageStrategyContract.connect(signer)

  const result = await signedContract.upgradeProxy(vaultAddress)

  return result.hash
}

upgradeLeverageStrategy.encode = upgradeLeverageStrategyEncode
upgradeLeverageStrategy.estimateGas = upgradeLeverageStrategyGas


export default upgradeLeverageStrategy
