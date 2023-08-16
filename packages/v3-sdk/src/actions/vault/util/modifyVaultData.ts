type CommonVaultData = {
  avgRewardPerAsset: string
  performance: string
}

export type ModifiedData<T> = Omit<T, 'performance'> & {
  apy: number
  performance: {
    total: string
  }
}

const modifyVaultData = <T extends CommonVaultData>(vault: T): ModifiedData<T> => {
  return {
    ...vault,
    apy: Number(vault.avgRewardPerAsset) * 365 * 100,
    performance: {
      total: vault.performance,
    },
  }
}


export default modifyVaultData
