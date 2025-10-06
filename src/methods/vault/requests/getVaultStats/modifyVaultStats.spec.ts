import { formatEther } from 'ethers'

import type { ModifiedVaultStats } from './types'
import modifyVaultStats from './modifyVaultStats'
import type { VaultStatsQueryPayload } from '../../../../graphql/subgraph/vault'


describe('modifyVaultStats function', () => {
  it('should correctly modify Vault Stats collection', () => {
    const sampleInput: VaultStatsQueryPayload = {
      vaultStats: [
        {
          apy: '1.78',
          timestamp: '1727049600000000',
          earnedAssets: '337535438824070468',
          totalAssets: '6894313501899116340545',
          extraEarnedAssets: '337535438824070468',
          stakeEarnedAssets: '337535438824070468',
        },
      ],
    }

    const rewards = Number(formatEther('337535438824070468'))
    const balance = Number(formatEther('6894313501899116340545'))
    const extraRewards = Number(formatEther('337535438824070468'))
    const stakeRewards = Number(formatEther('337535438824070468'))

    const expectedResult: ModifiedVaultStats[] = [
      {
        rewards,
        balance,
        apy: 1.78,
        extraRewards,
        stakeRewards,
        time: 1727049600,
      },
    ]

    const result = modifyVaultStats(sampleInput)

    expect(result).toEqual(expectedResult)
  })
})
