import { BigDecimal, constants } from '../../../helpers'


const fullPercent = 10_000

const getVaultOsTokenMintApy = (osTokenApy: number, feePercent: number, ltvPercent: bigint): number => {
  if (ltvPercent === 0n || feePercent >= fullPercent) {
    return 0
  }

  return new BigDecimal(osTokenApy)
    .multiply(feePercent)
    .multiply(constants.blockchain.amount1)
    .divide(fullPercent - feePercent)
    .divide(ltvPercent)
    .toNumber()
}


export default getVaultOsTokenMintApy
