import { BurnInput } from './types'
import { commonLogic } from './common'


const burnEncode = async (values: BurnInput): Promise<StakeWise.TransactionData> => {
  const { shares } = values

  const vaultContract = commonLogic(values)

  return vaultContract.burnOsToken.populateTransaction(shares)
}


export default burnEncode
