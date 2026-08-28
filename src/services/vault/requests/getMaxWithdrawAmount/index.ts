import { parseEther } from 'ethers'

import getStakeBalance from '../getStakeBalance'
import { vaultMulticall } from '../../../../contracts'
import getMaxExitShares from '../../helpers/getMaxExitShares'
import { wrapAbortPromise } from '../../../../modules/gql-module'

import { validate } from './validate'


export type GetMaxWithdrawAmountInput = StakeWise.BaseInput & {
  withBurn?: boolean
}

const min = parseEther('0.00001')

const getMaxWithdrawAmount = async (values: GetMaxWithdrawAmountInput) => {
  const { contracts } = values

  const { userAddress, vaultAddress, withBurn } = validate(values)

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  let burnShares = 0n

  if (withBurn) {
    const [ walletShares, osTokenShares ] = await Promise.all([
      contracts.tokens.mintToken.balanceOf(userAddress),
      vaultContract.osTokenPositions(userAddress),
    ])

    burnShares = walletShares < osTokenShares ? walletShares : osTokenShares
  }

  const { assets: subgraphAssets } = await getStakeBalance(values)
  const maxExitShares = await getMaxExitShares({ ...values, userAddress, vaultAddress, burnShares })

  if (!maxExitShares) {
    return 0n
  }

  const [ { assets } ] = await vaultMulticall<[ { assets: bigint } ]>({
    ...values,
    userAddress,
    vaultAddress,
    vaultContract,
    request: {
      params: [ { method: 'convertToAssets', args: [ maxExitShares ] } ],
      callStatic: true,
    },
  })

  if (assets > subgraphAssets) {
    return subgraphAssets
  }

  if (assets <= min) {
    return 0n
  }

  return assets
}


export default wrapAbortPromise<GetMaxWithdrawAmountInput, bigint>(getMaxWithdrawAmount)
