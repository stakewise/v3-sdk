import { graphqlFetch } from '../../../modules/gql-module'


type HarvestParamsQueryVariables = SubgraphGraph.Exact<{
  address: SubgraphGraph.Scalars['ID']
}>
type HarvestParamsQueryPayload = { harvestParams: { proof: Array<string>, rewardsRoot: string, reward: string, unlockedMevReward: string } }


const query = 'query HarvestParams($address: ID!) { harvestParams: vault(id: $address) { proof rewardsRoot reward: proofReward unlockedMevReward: proofUnlockedMevReward }}'


const fetchHarvestParamsQuery = <ModifiedData = HarvestParamsQueryPayload>(
  { url, variables, modifyResult }: ModuleGQL.FetchCodegenInput<HarvestParamsQueryPayload, HarvestParamsQueryVariables, ModifiedData>
) => (
  graphqlFetch<HarvestParamsQueryPayload, HarvestParamsQueryVariables, ModifiedData>({
    url,
    query,
    variables,
    modifyResult,
  })
)


export { fetchHarvestParamsQuery }
export type { HarvestParamsQueryPayload, HarvestParamsQueryVariables }
