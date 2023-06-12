import { graphqlFetch } from '../../../modules/gql-module'


type VaultValidatorsQueryVariables = BackendGraph.Exact<{
  address: BackendGraph.Scalars['String']
}>
type VaultValidatorsQueryPayload = { vaults: Array<{ validators: Array<{ earned: string, createdAt: string, publicKey: string, apy: string }> }> }


const query = 'query VaultValidators($address: String!) { vaults(id: $address) { validators { apy: apr earned createdAt publicKey } }}'


const fetchVaultValidatorsQuery = <ModifiedData = VaultValidatorsQueryPayload>(
  { url, variables, modifyResult }: ModuleGQL.FetchCodegenInput<VaultValidatorsQueryPayload, VaultValidatorsQueryVariables, ModifiedData>
) => (
  graphqlFetch<VaultValidatorsQueryPayload, VaultValidatorsQueryVariables, ModifiedData>({
    url,
    query,
    variables,
    modifyResult,
  })
)


export { fetchVaultValidatorsQuery }
export type { VaultValidatorsQueryPayload, VaultValidatorsQueryVariables }

