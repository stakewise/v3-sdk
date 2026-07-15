import { DepositAndMintInput } from '../types'
import { commonLogic } from './common'


type DepositAndMintDataOutput = StakeWise.TransactionData & {
  value: bigint
}

const depositAndMintEncode = async (values: DepositAndMintInput): Promise<DepositAndMintDataOutput> => {
  const { assets } = values

  const { vaultContract, baseParams, updateStateParams, canHarvest } = await commonLogic(values)

  if (canHarvest) {
    const rx = await vaultContract.updateStateAndDepositAndMintOsToken.populateTransaction(...updateStateParams)

    return {
      ...rx,
      value: assets,
    }
  }
  else {
    const rx = await vaultContract.depositAndMintOsToken.populateTransaction(...baseParams)

    return {
      ...rx,
      value: assets,
    }
  }
}


export default depositAndMintEncode
