import * as z from 'zod/mini'
import { parseEther } from 'ethers'

import { constants, schema, parseArgs } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'


const validateSchema = z.object({
  ltvPercent: schema.bigint,
  mintedAssets: schema.bigint,
  stakedAssets: schema.bigint,
  vaultAddress: schema.ethAddress,
})

export type GetMaxWithdrawInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const min = parseEther('0.00001')

const getMaxWithdraw = async (values: GetMaxWithdrawInput) => {
  const { contracts, mintedAssets, stakedAssets, ltvPercent } = values

  parseArgs(validateSchema, values)

  if (!mintedAssets) {
    return stakedAssets
  }

  if (ltvPercent <= 0 || stakedAssets < min) {
    return 0n
  }

  const avgRewardPerSecond = await contracts.base.mintTokenController.avgRewardPerSecond()

  const secondsInHour = 60n * 60n
  const gap = avgRewardPerSecond * secondsInHour * mintedAssets / constants.blockchain.amount1
  const lockedAssets = (mintedAssets + gap) * constants.blockchain.amount1 / ltvPercent
  const maxWithdrawAssets = stakedAssets - lockedAssets

  return maxWithdrawAssets > min ? maxWithdrawAssets : 0n
}


export default wrapAbortPromise<GetMaxWithdrawInput, bigint>(getMaxWithdraw)
