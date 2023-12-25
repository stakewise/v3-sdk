import type { SnapshotsQueryPayload } from '../../../../graphql/backend/vault'
import modifySnapshots, { modifySnapshot } from './modifySnapshots'


describe('modifyVaultSnapshot and modifyVaultSnapshots functions', () => {
  const sampleInput: SnapshotsQueryPayload = {
    vaultSnapshots: [
      {
        date: '1700870400',
        totalAssets: '3906945363776011390139',
        weeklyApy: '1.8793377858',
      },
      {
        date: '1700956800',
        totalAssets: '3907107984571011390139',
        weeklyApy: '1.6767640360',
      },
    ],
    firstSnapshots: [
      {
        date: '1700870400',
        totalAssets: '3906945363776011390139',
        weeklyApy: '1.8793377858',
      },
    ],
  }

  it('should correctly modify a single vault snapshot', () => {
    const vaultSnapshot = sampleInput.vaultSnapshots[0]

    const result = modifySnapshot(vaultSnapshot)

    expect(result).toEqual({
      APY: Number(vaultSnapshot.weeklyApy),
      TVL: 3906.945363776011,
    })
  })

  it('should correctly modify multiple vault snapshots', () => {
    const expectedResult = {
      days: {
        1700870400: {
          APY: Number(sampleInput.vaultSnapshots[0].weeklyApy),
          TVL: 3906.945363776011,
        },
        1700956800: {
          APY: Number(sampleInput.vaultSnapshots[1].weeklyApy),
          TVL: 3907.1079845710115,
        },
      },
      first: {
        APY: Number(sampleInput.firstSnapshots[0].weeklyApy),
        TVL: 3906.945363776011,
      },
    }

    const result = modifySnapshots(sampleInput)

    expect(result).toEqual(expectedResult)
  })
})
