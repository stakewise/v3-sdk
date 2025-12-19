import type { ValidatorsQueryPayload } from '../../../../graphql/backend/vault'


type ValidatorsPayload = Pick<ValidatorsQueryPayload['vaultValidators'][number], 'apy' | 'publicKey'>

export type ModifiedValidators = Array<ValidatorsPayload & {
  createdAt: number
  earned: string
  link: string
}>
