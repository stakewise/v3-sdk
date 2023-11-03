import type { VaultValidatorsQueryPayload } from '../../../../graphql/backend/vault'

// earned: string, createdAt: string, publicKey: string, apy: string
type AllocatorActionsPayload = Pick<VaultValidatorsQueryPayload['vaults'][number]['validators'][number], 'apy' | 'publicKey' | 'earned'>

export type ModifiedValidators = Array<AllocatorActionsPayload & {
  createdAt: number
  link: string
}>
