import { graphqlFetch } from '../../../modules/gql-module'
import constants from '../../../constants'


type HarvestParamsQueryVariables = SubgraphGraph.Exact<{
  address: SubgraphGraph.Scalars['ID']['input']
}>
type HarvestParamsQueryPayload = { harvestParams: { proof: Array<string>, rewardsRoot: string, reward: string, unlockedMevReward: string } }


const query = 'query HarvestParams($address: ID!) { harvestParams: vault(id: $address) { proof rewardsRoot reward: proofReward unlockedMevReward: proofUnlockedMevReward }}'


const fetchHarvestParamsQuery = <ModifiedData = HarvestParamsQueryPayload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<HarvestParamsQueryPayload, HarvestParamsQueryVariables, ModifiedData>
) => (
  graphqlFetch<HarvestParamsQueryPayload, HarvestParamsQueryVariables, ModifiedData>({
    url: constants.url.subgraph,
    query,
    variables,
    modifyResult,
  })
)


export { fetchHarvestParamsQuery }
export type { HarvestParamsQueryPayload, HarvestParamsQueryVariables }
