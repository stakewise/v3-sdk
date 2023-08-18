import { backend, subgraph } from '../graphql'


export { default as fetchVault } from './vault'

// Subgraph vault
export const fetchAllocatorActions = subgraph.allocatorActions.fetchAllocatorActionsQuery

// Backend vault
export const fetchValidators = backend.vault.fetchVaultValidatorsQuery
export const fetchPublicKeysValidation = backend.vault.fetchPublicKeysValidationQuery
export const uploadMetadata = backend.vault.submitUploadMetadataMutation
