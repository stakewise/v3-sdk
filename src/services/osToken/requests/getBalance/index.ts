import * as z from 'zod/mini'

import { wrapAbortPromise } from '../../../../modules/gql-module'
import { schema, parseArgs } from '../../../../helpers'


const validateSchema = z.object({
  userAddress: schema.ethAddress,
  vaultAddress: schema.ethAddress,
})

export type GetOsTokenBalanceInput = StakeWise.CommonParams & z.input<typeof validateSchema>

type Output = {
  assets: bigint
  shares: bigint
}

const getBalance = async (values: GetOsTokenBalanceInput) => {
  const { contracts, vaultAddress, userAddress } = values

  parseArgs(validateSchema, values)

  const vaultContract = contracts.helpers.createVault({ vaultAddress })
  const mintedShares = await vaultContract.osTokenPositions(userAddress)
  const mintedAssets = await contracts.base.mintTokenController.convertToAssets(mintedShares)

  const result: Output = {
    assets: mintedAssets,
    shares: mintedShares,
  }

  return result
}


export default wrapAbortPromise<GetOsTokenBalanceInput, Output>(getBalance)
