import { graphqlFetch } from '../../../modules/gql-module'
import constants from '../../../constants'


type VaultValidatorsQueryVariables = BackendGraph.Exact<{
  address: BackendGraph.Scalars['String']['input']
}>
type VaultValidatorsQueryPayload = { vaults: Array<{ validators: Array<{ earned: string, createdAt: string, publicKey: string, apy: string }> }> }


const query = 'query VaultValidators($address: String!) { vaults(id: $address) { validators { apy: apr earned createdAt publicKey } }}'


const fetchVaultValidatorsQuery = <ModifiedData = VaultValidatorsQueryPayload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<VaultValidatorsQueryPayload, VaultValidatorsQueryVariables, ModifiedData>
) => (
  graphqlFetch<VaultValidatorsQueryPayload, VaultValidatorsQueryVariables, ModifiedData>({
    url: constants.url.backend,
    query,
    variables,
    modifyResult,
  })
)


export { fetchVaultValidatorsQuery }
export type { VaultValidatorsQueryPayload, VaultValidatorsQueryVariables }
