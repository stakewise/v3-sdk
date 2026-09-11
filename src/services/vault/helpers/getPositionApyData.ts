import getVaultOsTokenMintApy from './getVaultOsTokenMintApy'


type OsTokenConfig = {
  ltvPercent: string
  leverageMaxMintLtvPercent: string
}

type Vault = {
  apy: string
  allocatorMaxBoostApy: string
  osTokenConfig?: OsTokenConfig | null
}

type Aave = {
  borrowApy: string
  leverageMaxBorrowLtvPercent: string
}

type OsToken = {
  apy: string
  feePercent: number
}

type GetPositionApyDataInput = {
  vault: Vault
  aave?: Aave | null
  osTokenRate: bigint
  osToken?: OsToken | null
}

export type PositionApyData = {
  vaultApy: number
  borrowApy: number
  osTokenApy: number
  feePercent: number
  ltvPercent: bigint
  osTokenRate: bigint
  osTokenMintApy: number
  allocatorMaxBoostApy: number
  leverageMaxMintLtvPercent: bigint
  leverageMaxBorrowLtvPercent: bigint
}

const getPositionApyData = (values: GetPositionApyDataInput): PositionApyData => {
  const { vault, aave, osToken, osTokenRate } = values

  const vaultApy = Number(vault.apy)
  const allocatorMaxBoostApy = Number(vault.allocatorMaxBoostApy)
  const ltvPercent = BigInt(vault.osTokenConfig?.ltvPercent || 0)
  const leverageMaxMintLtvPercent = BigInt(vault.osTokenConfig?.leverageMaxMintLtvPercent || 0)

  const osTokenApy = Number(osToken?.apy || 0)
  const feePercent = Number(osToken?.feePercent || 0)
  const borrowApy = Number(aave?.borrowApy || 0)
  const leverageMaxBorrowLtvPercent = BigInt(aave?.leverageMaxBorrowLtvPercent || 0)

  const osTokenMintApy = getVaultOsTokenMintApy(osTokenApy, feePercent, ltvPercent)

  return {
    vaultApy,
    borrowApy,
    osTokenApy,
    feePercent,
    ltvPercent,
    osTokenRate,
    osTokenMintApy,
    allocatorMaxBoostApy,
    leverageMaxMintLtvPercent,
    leverageMaxBorrowLtvPercent,
  }
}


export default getPositionApyData
