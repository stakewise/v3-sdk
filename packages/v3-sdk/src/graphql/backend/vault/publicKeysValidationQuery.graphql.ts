import { graphqlFetch } from '../../../modules/gql-module'
import constants from '../../../constants'


type PublicKeysValidationQueryVariables = BackendGraph.Exact<{
  publicKeys: Array<BackendGraph.Scalars['String']['input']>
}>
type PublicKeysValidationQueryPayload = { publicKeysValidation: boolean }


const query = 'query PublicKeysValidation( $publicKeys: [String!]!) { publicKeysValidation( publicKeys: $publicKeys )}'


const fetchPublicKeysValidationQuery = <ModifiedData = PublicKeysValidationQueryPayload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<PublicKeysValidationQueryPayload, PublicKeysValidationQueryVariables, ModifiedData>
) => (
  graphqlFetch<PublicKeysValidationQueryPayload, PublicKeysValidationQueryVariables, ModifiedData>({
    url: constants.url.backend,
    query,
    variables,
    modifyResult,
  })
)


export { fetchPublicKeysValidationQuery }
export type { PublicKeysValidationQueryPayload, PublicKeysValidationQueryVariables }
