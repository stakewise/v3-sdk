import { subgraph } from 'graphql'
import { apiUrls, validateArgs } from 'helpers'
import { DaySnapshotsQueryVariables } from 'graphql/subgraph/daySnapshots'

import { ModifiedDaySnapshots } from './types'
import modifyDaySnapshots from './modifyDaySnapshots'


type GetDaySnapshotsInput = {
  options: StakeWise.Options
  unixStartOfDay: DaySnapshotsQueryVariables['where']['date_gte']
  vaultAddress: DaySnapshotsQueryVariables['where']['vault_']['id']
}

const getDaySnapshots = async (input: GetDaySnapshotsInput) => {
  const { options, vaultAddress, unixStartOfDay } = input

  validateArgs.address({ vaultAddress })
  validateArgs.number({ unixStartOfDay })

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
