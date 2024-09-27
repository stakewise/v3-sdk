import { formatEther } from 'ethers'

import type { ModifiedUserStats } from './types'
import modifyUserStats from './modifyUserStats'
import type { UserStatsQueryPayload } from '../../../../graphql/subgraph/vault'


describe('modifyUserStats function', () => {
  it('should correctly modify User Stats collection', () => {
    const sampleInput: UserStatsQueryPayload = {
      allocator: [
        {
          timestamp: '1727136000000000',
          earnedAssets: '27734011365427',
          totalAssets: '715748104014280751',
        },
        {
          timestamp: '1727049600000000',
          earnedAssets: '31538735933515',
          totalAssets: '715720370002915324',
        },
        {
          timestamp: '1726963200000000',
          earnedAssets: '28263735668759',
          totalAssets: '715688831266981809',
        },
      ],
      exitRequest: [
        {
          timestamp: '1727136000000000',
          earnedAssets: '27734011365427',
          totalAssets: '715748104014280751',
        },
        {
          timestamp: '1726876800000000',
          earnedAssets: '36906487302928',
          totalAssets: '715660567531313050',
        },
      ],
      rewardSplitter: [
        {
          timestamp: '1727049600000000',
          earnedAssets: '31538735933515',
          totalAssets: '715720370002915324',
        },
        {
          timestamp: '1726790400000000',
          earnedAssets: '31763194717568',
          totalAssets: '715623661044010122',
        },
      ],
    }

    const expectedResult: ModifiedUserStats = {
      balance: [
        {
          time: 1727136000,
          value: Number(formatEther('1431496208028561600')),
        },
        {
          time: 1727049600,
          value: Number(formatEther('1431440740005830700')),
        },
        {
          time: 1726963200,
          value: Number(formatEther('715688831266981809')),
        },
        {
          time: 1726876800,
          value: Number(formatEther('715660567531313050')),
        },
        {
          time: 1726790400,
          value: Number(formatEther('715623661044010122')),
        },
      ],
      rewards: [
        {
          time: 1727136000,
          value: Number(formatEther('55468022730854')),
        },
        {
          time: 1727049600,
          value: Number(formatEther('63077471867030')),
        },
        {
          time: 1726963200,
          value: Number(formatEther('28263735668759')),
        },
        {
          time: 1726876800,
          value: Number(formatEther('36906487302928')),
        },
        {
          time: 1726790400,
          value: Number(formatEther('31763194717568')),
        },
      ],
      apy: [
        {
          time: 1727136000,
          value: (
            Number(formatEther('27734011365427')) * 365 * 100)
            / (Number(formatEther('715748104014280751')) - Number(formatEther('27734011365427'))
          ),
        },
        {
          time: 1727049600,
          value: (
            Number(formatEther('31538735933515')) * 365 * 100)
            / (Number(formatEther('715720370002915324')) - Number(formatEther('31538735933515'))
            ),
        },
        {
          time: 1726963200,
          value: (
            Number(formatEther('28263735668759')) * 365 * 100)
            / (Number(formatEther('715688831266981809')) - Number(formatEther('28263735668759'))
          ),
        },
      ],
    }

    const result = modifyUserStats(sampleInput)

    expect(result).toEqual({
      apy: expectedResult.apy.sort((a, b) => a.time - b.time),
      balance: expectedResult.balance.sort((a, b) => a.time - b.time),
      rewards: expectedResult.rewards.sort((a, b) => a.time - b.time),
    })
  })
})
