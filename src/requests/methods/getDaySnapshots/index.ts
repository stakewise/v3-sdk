import { apiUrls } from 'helpers'
import { subgraph } from 'graphql'
import { DaySnapshotsQueryVariables } from 'graphql/subgraph/daySnapshots'

import { ModifiedDaySnapshots } from './types'
import modifyDaySnapshots from './modifyDaySnapshots'


type GetDaySnapshotsInput = {
  options: SDK.Options
  unixStartOfDay: DaySnapshotsQueryVariables['where']['date_gte']
  vaultAddress: DaySnapshotsQueryVariables['where']['vault_']['id']
}

const getDaySnapshots = async (input: GetDaySnapshotsInput) => {
  const { vaultAddress, unixStartOfDay, options } = input

  const data = await subgraph.daySnapshots.fetchDaySnapshotsQuery<ModifiedDaySnapshots>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      where: {
        date_gte: unixStartOfDay,
        vault_: { id: vaultAddress.toLowerCase() },
      },
      whereFirstSnapshots: {
        date_lt: unixStartOfDay,
        vault_: { id: vaultAddress.toLowerCase() },
      },
    } as DaySnapshotsQueryVariables,
    modifyResult: modifyDaySnapshots,
  })

  return data
}


export default getDaySnapshots
