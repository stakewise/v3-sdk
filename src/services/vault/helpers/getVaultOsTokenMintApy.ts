import { BigDecimal, constants } from '../../../helpers'


const getVaultOsTokenMintApy = (osTokenApy: number, feePercent: number, ltvPercent: bigint): number => {
  if (ltvPercent === 0n) {
    return 0
  }

  return new BigDecimal(osTokenApy)
    .multiply(feePercent)
    .multiply(constants.blockchain.amount1)
    .divide(10000 - feePercent)
    .divide(ltvPercent)
    .toNumber()
}


export default getVaultOsTokenMintApy
