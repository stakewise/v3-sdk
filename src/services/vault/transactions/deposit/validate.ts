import { ZeroAddress } from 'ethers'

import type { DepositInput } from './types'
import { validateArgs } from '../../../../utils'


export const validate = (values: DepositInput) => {
  const { userAddress, vaultAddress, referrerAddress = ZeroAddress, assets } = values

  validateArgs.bigint({ assets })
  validateArgs.address({ userAddress, vaultAddress, referrerAddress })
}
