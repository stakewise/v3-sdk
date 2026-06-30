import { ZeroAddress } from 'ethers'

import { validateArgs } from '../../../helpers'
import { getDepositAndMintCalls } from '../helpers'
import type { DepositAndMintBatchInput } from './types'


const depositAndMintEncode = async (values: DepositAndMintBatchInput): Promise<StakeWise.BatchData> => {
  const { assets, receiveShares, userAddress, vaultAddress, referrerAddress = ZeroAddress } = values

  validateArgs.bigint({ assets, receiveShares })
  validateArgs.address({ userAddress, vaultAddress, referrerAddress })

  const calls = await getDepositAndMintCalls({ ...values, osTokenShares: receiveShares })

  return { calls }
}


export default depositAndMintEncode
