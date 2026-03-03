/* eslint-disable max-len */
import type { Provider } from 'ethers'

import { Erc20Abi } from './abis'
import createContract from './createContract'


const createErc20Contract = (address: string, provider: Provider) => (
  createContract<StakeWise.ABI.Erc20Token>(address, Erc20Abi, provider)
)


export default createErc20Contract
