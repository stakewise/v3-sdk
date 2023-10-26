import { BurnInput } from './types'
import { commonLogic } from './common'


const burnEncode = async (values: BurnInput): Promise<StakeWise.TransactionData> => {
  const { shares } = values

  const vaultContract = commonLogic(values)

  const rx = await vaultContract.burnOsToken.populateTransaction(shares)

  return {
    data: rx.data,
    to: rx.to,
  }
}


export default burnEncode
