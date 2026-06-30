import { MaxUint256, ZeroAddress } from 'ethers'

import { createErc20Contract } from '../../../contracts'
import { getNetworkTypes } from '../../../helpers'
import getHarvestArgs from '../../../contracts/multicall/util/getHarvestArgs'
import { multicall } from '../../vault/transactions/multicall'


export type GetDepositAndMintCallsInput = StakeWise.CommonParams & {
  assets: bigint
  osTokenShares: bigint
  userAddress: string
  vaultAddress: string
  referrerAddress?: string
}

const getDepositAndMintCalls = async (values: GetDepositAndMintCallsInput): Promise<StakeWise.BatchData['calls']> => {
  const {
    config, provider, contracts, options,
    assets, osTokenShares, userAddress, vaultAddress, referrerAddress = ZeroAddress,
  } = values

  const { isEthereum } = getNetworkTypes(options)

  if (isEthereum) {
    const vaultContract = contracts.helpers.createVault({
      vaultAddress,
      options: {
        isDepositWithMint: true,
      },
    })

    const harvestArgs = await getHarvestArgs(values)
    const overrides = { value: assets }

    const depositTxData = harvestArgs
      ? await vaultContract.updateStateAndDepositAndMintOsToken.populateTransaction(
        userAddress, osTokenShares, referrerAddress, harvestArgs, overrides
      )
      : await vaultContract.depositAndMintOsToken.populateTransaction(
        userAddress, osTokenShares, referrerAddress, overrides
      )

    return [ depositTxData ] as StakeWise.BatchData['calls']
  }

  const depositTokenContract = createErc20Contract(config.addresses.tokens.depositToken, provider)

  const [ allowance, depositAndMintTxData ] = await Promise.all([
    depositTokenContract.allowance(userAddress, vaultAddress),
    multicall<StakeWise.TransactionData>({
      ...values,
      request: {
        params: [
          { method: 'deposit', args: [ assets, userAddress, referrerAddress ] },
          { method: 'mintOsToken', args: [ userAddress, osTokenShares, referrerAddress ] },
        ],
        transactionData: true,
      },
    }),
  ])

  const approveTxData = allowance < assets
    ? await depositTokenContract.approve.populateTransaction(vaultAddress, MaxUint256)
    : null

  return [
    approveTxData,
    depositAndMintTxData,
  ].filter(Boolean) as StakeWise.BatchData['calls']
}


export default getDepositAndMintCalls
