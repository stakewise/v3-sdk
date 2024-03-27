import checkAccess from './checkAccess'
import { commonLogic } from './common'
import setValidatorsRootGas from './setValidatorsRootGas'
import setValidatorsRootEncode from './setValidatorsRootEncode'
import type { SetValidatorsRoot } from './types'
import { vaultMulticall } from '../../../../contracts'


const setValidatorsRoot: SetValidatorsRoot = async (values) => {
  const multicallCommonArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

  return result.hash
}

setValidatorsRoot.encode = checkAccess<StakeWise.TransactionData>(setValidatorsRootEncode)
setValidatorsRoot.estimateGas = checkAccess<bigint>(setValidatorsRootGas)


export default checkAccess<string>(setValidatorsRoot)
