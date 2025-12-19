import type { ValidatorsQueryPayload } from '../../../../graphql/backend/vault'


type ValidatorsPayload = Pick<ValidatorsQueryPayload['vaultValidators'][number], 'apy' | 'publicKey' | 'income'>

export type ModifiedValidators = Array<ValidatorsPayload & {
  createdAt: number
  link: string
}>
