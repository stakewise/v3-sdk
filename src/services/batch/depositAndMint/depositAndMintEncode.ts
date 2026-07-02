import * as z from 'zod/mini'
import { ZeroAddress } from 'ethers'

import { parseArgs, schema } from '../../../helpers'
import { getDepositAndMintCalls } from '../helpers'
import type { DepositAndMintBatchInput } from './types'


const depositAndMintEncode = async (values: DepositAndMintBatchInput): Promise<StakeWise.BatchData> => {
  const { assets, receiveShares, userAddress, vaultAddress, referrerAddress = ZeroAddress } = values

  parseArgs(z.object({
    assets: schema.bigint,
    receiveShares: schema.bigint,
    userAddress: schema.ethAddress,
    vaultAddress: schema.ethAddress,
    referrerAddress: schema.ethAddress,
  }), { assets, receiveShares, userAddress, vaultAddress, referrerAddress })

  const calls = await getDepositAndMintCalls({ ...values, osTokenShares: receiveShares })

  return { calls }
}


export default depositAndMintEncode
