import { BigDecimal } from '../../utils'


type Input = {
  value: bigint
  vaultAPY: number
  maxBoostAPY: number
  boostPercent: number
  maxMintShares: bigint
}

const getBoostApy = ({ value, vaultAPY, maxBoostAPY, boostPercent, maxMintShares }: Input) => {
  const apyDiff = maxBoostAPY - vaultAPY

  const balance = boostPercent ? (
    new BigDecimal(maxMintShares)
      .divide(100)
      .multiply(boostPercent)
      .toString()
  ) : maxMintShares

  const boostAPY = new BigDecimal(apyDiff)
    .multiply(value)
    .divide(balance)
    .decimals(2)
    .toNumber()

  return Number((boostAPY +  vaultAPY).toFixed(2))
}


export default getBoostApy
