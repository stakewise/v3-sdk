import type { Provider } from 'ethers'
import { Contract } from 'ethers'

import { UsdRateAbi, EthRateAbi } from './abis'
import type { UsdRateAbi as UsdRateType, EthRateAbi as EthRateType } from './types'


const createUsdRateContract = (address: string, provider: Provider) => {
  const contract = new Contract(address, UsdRateAbi, provider) as unknown

  return contract as UsdRateType
}

const createEthRateContract = (address: string, provider: Provider) => {
  const contract = new Contract(address, EthRateAbi, provider) as unknown

  return contract as EthRateType
}

type CreateRatesContractsOutput = {
  USD: {
    ETH: StakeWise.ABI.UsdRate
    EUR: StakeWise.ABI.UsdRate
    GBP: StakeWise.ABI.UsdRate
  }
  ETH: {
    GNO: StakeWise.ABI.EthRate
    xDAI: StakeWise.ABI.EthRate
  }
}

const createRatesContracts = (provider: Provider): CreateRatesContractsOutput => {
  const ETH = createUsdRateContract('0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', provider)
  const EUR = createUsdRateContract('0xb49f677943BC038e9857d61E7d053CaA2C1734C1', provider)
  const GBP = createUsdRateContract('0x5c0Ab2d9b5a7ed9f470386e82BB36A3613cDd4b5', provider)

  const GNO = createEthRateContract('0xA614953dF476577E90dcf4e3428960e221EA4727', provider)
  const xDAI = createEthRateContract('0x773616E4d11A78F511299002da57A0a94577F1f4', provider)

  const result = {
    USD: { ETH, EUR, GBP },
    ETH: { GNO, xDAI },
  }

  return result
}


export default createRatesContracts
