import { DaySnapshotsQueryPayload } from 'graphql/subgraph/daySnapshots'
import modifyDaySnapshots, { modifyDaySnapshot } from './modifyDaySnapshots'


describe('modifyDaySnapshot and modifyDaySnapshots functions', () => {
  const sampleInput: DaySnapshotsQueryPayload = {
    daySnapshots: [
      {
        date: 1694908800,
        totalAssets: '344379922475148628745',
        rewardPerAsset: '0.00005615254142281017424596658035098357',
      },
      {
        date: 1694995200,
        totalAssets: '344382187878289278175',
        rewardPerAsset: '0.000003032318481984842735504620061173766',
      },
    ],
    firstSnapshots: [
      {
        date: 1694908800,
        totalAssets: '344379922475148628745',
        rewardPerAsset: '0.00005615254142281017424596658035098357',
      },
    ],
  }

  it('should correctly modify a single day snapshot', () => {
    const daySnapshot = sampleInput.daySnapshots[0]

    const result = modifyDaySnapshot(daySnapshot)

    expect(result).toEqual({
      APY: Number(daySnapshot.rewardPerAsset) * 365 * 100,
      TVL: '344.379922475148628745',
    })
  })

  it('should correctly modify multiple day snapshots', () => {
    const expectedResult = {
      days: [
        {
          APY: Number(sampleInput.daySnapshots[0].rewardPerAsset) * 365 * 100,
          TVL: '344.379922475148628745',
        },
        {
          APY: Number(sampleInput.daySnapshots[1].rewardPerAsset) * 365 * 100,
          TVL: '344.382187878289278175',
        },
      ],
      first: {
        APY: Number(sampleInput.firstSnapshots[0].rewardPerAsset) * 365 * 100,
        TVL: '344.379922475148628745',
      },
    }

    const result = modifyDaySnapshots(sampleInput)

    expect(result).toEqual(expectedResult)
  })
})
