import { graphqlFetch } from '../../../modules/gql-module'


type PublicKeysValidationQueryVariables = BackendGraph.Exact<{
  publicKeys: Array<BackendGraph.Scalars['String']>
}>
type PublicKeysValidationQueryPayload = { publicKeysValidation: boolean }


const query = 'query PublicKeysValidation( $publicKeys: [String!]!) { publicKeysValidation( publicKeys: $publicKeys )}'


const fetchPublicKeysValidationQuery = <ModifiedData = PublicKeysValidationQueryPayload>(
  { url, variables, modifyResult }: ModuleGQL.FetchCodegenInput<PublicKeysValidationQueryPayload, PublicKeysValidationQueryVariables, ModifiedData>
) => (
  graphqlFetch<PublicKeysValidationQueryPayload, PublicKeysValidationQueryVariables, ModifiedData>({
    url,
    query,
    variables,
    modifyResult,
  })
)


export { fetchPublicKeysValidationQuery }
export type { PublicKeysValidationQueryPayload, PublicKeysValidationQueryVariables }
