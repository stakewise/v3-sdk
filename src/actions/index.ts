import { backend, subgraph } from 'graphql'


// Subgraph vault
export { default as fetchVault } from './vault'
export const fetchAllocatorActions = subgraph.allocatorActions.fetchAllocatorActionsQuery

// Backend vault
export const fetchValidators = backend.vault.fetchVaultValidatorsQuery
export const uploadMetadata = backend.vault.submitUploadMetadataMutation
export const fetchPublicKeysValidation = backend.vault.fetchPublicKeysValidationQuery
