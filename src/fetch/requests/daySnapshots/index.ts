import { Network } from 'helpers'
import { subgraph } from 'graphql'
import { DaySnapshotsQueryVariables } from 'graphql/subgraph/daySnapshots'

import { ModifiedDaySnapshots } from './types'
import modifyDaySnapshots from './modifyDaySnapshots'


type DaySnapshotsInput = {
  network: Network
  unixStartOfDay: DaySnapshotsQueryVariables['where']['date_gte']
  vaultAddress: DaySnapshotsQueryVariables['where']['vault_']['id']
}

const daySnapshots = async (input: DaySnapshotsInput) => {
  const { vaultAddress, unixStartOfDay, network } = input

  const data = await subgraph.daySnapshots.fetchDaySnapshotsQuery<ModifiedDaySnapshots>({
    network,
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


export default daySnapshots
