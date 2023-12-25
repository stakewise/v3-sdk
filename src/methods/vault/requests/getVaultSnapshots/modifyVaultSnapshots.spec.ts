import type { VaultSnapshotsQueryPayload } from '../../../../graphql/backend/vault'
import modifyVaultSnapshots, { modifyVaultSnapshot } from './modifyVaultSnapshots'


describe('modifyVaultSnapshot and modifyVaultSnapshots functions', () => {
  const sampleInput: VaultSnapshotsQueryPayload = {
    vaultSnapshots: [
      {
        date: '1700870400',
        totalAssets: '3906945363776011390139',
        rewardPerAsset: '1.8793377858',
      },
      {
        date: '1700956800',
        totalAssets: '3907107984571011390139',
        rewardPerAsset: '1.6767640360',
      },
    ],
    firstSnapshots: [
      {
        date: '1700870400',
        totalAssets: '3906945363776011390139',
        rewardPerAsset: '1.8793377858',
      },
    ],
  }

  it('should correctly modify a single vault snapshot', () => {
    const vaultSnapshot = sampleInput.vaultSnapshots[0]

    const result = modifyVaultSnapshot(vaultSnapshot)

    expect(result).toEqual({
      APY: Number(vaultSnapshot.rewardPerAsset),
      TVL: 3906.945363776011,
    })
  })

  it('should correctly modify multiple vault snapshots', () => {
    const expectedResult = {
      days: {
        1700870400: {
          APY: Number(sampleInput.vaultSnapshots[0].rewardPerAsset),
          TVL: 3906.945363776011,
        },
        1700956800: {
          APY: Number(sampleInput.vaultSnapshots[1].rewardPerAsset),
          TVL: 3907.1079845710115,
        },
      },
      first: {
        APY: Number(sampleInput.firstSnapshots[0].rewardPerAsset),
        TVL: 3906.945363776011,
      },
    }

    const result = modifyVaultSnapshots(sampleInput)

    expect(result).toEqual(expectedResult)
  })
})
