import { BigDecimal } from '../../utils'


type Input = {
  value: bigint
  vaultAPY: number
  maxBoostAPY: number
  maxMintShares: bigint
}

const getBoostApy = ({ value, vaultAPY, maxBoostAPY, maxMintShares }: Input) => {
  const boostPercent = maxMintShares
    ? new BigDecimal(value).multiply(100).divide(maxMintShares)
    : 0n

  return new BigDecimal(maxBoostAPY)
    .minus(vaultAPY)
    .multiply(boostPercent)
    .divide(100)
    .plus(vaultAPY)
    .decimals(2)
    .toNumber()
}


export default getBoostApy
