import { graphqlFetch } from '../../../modules/gql-module'
import constants from '../../../constants'


type DaySnapshotsQueryVariables = SubgraphGraph.Exact<{
  where: SubgraphGraph.InputMaybe<SubgraphGraph.DaySnapshot_Filter>
  whereFirstSnapshots: SubgraphGraph.InputMaybe<SubgraphGraph.DaySnapshot_Filter>
}>
type DaySnapshotsQueryPayload = { daySnapshots: Array<{ date: number, totalAssets: string, rewardPerAsset: string }>, firstSnapshots: Array<{ date: number, totalAssets: string, rewardPerAsset: string }> }


const query = 'query DaySnapshots( $where: DaySnapshot_filter $whereFirstSnapshots: DaySnapshot_filter) { daySnapshots(where: $where) { date totalAssets rewardPerAsset } firstSnapshots: daySnapshots(where: $whereFirstSnapshots, first: 1) { date totalAssets rewardPerAsset }}'


const fetchDaySnapshotsQuery = <ModifiedData = DaySnapshotsQueryPayload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<DaySnapshotsQueryPayload, DaySnapshotsQueryVariables, ModifiedData>
) => (
  graphqlFetch<DaySnapshotsQueryPayload, DaySnapshotsQueryVariables, ModifiedData>({
    url: constants.url.subgraph,
    query,
    variables,
    modifyResult,
  })
)


export { fetchDaySnapshotsQuery }
export type { DaySnapshotsQueryPayload, DaySnapshotsQueryVariables }
