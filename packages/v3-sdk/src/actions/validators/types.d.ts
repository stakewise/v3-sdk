import { VaultValidatorsQueryPayload, VaultValidatorsQueryVariables } from '../../graphql/backend/vault'


type ValidatorData = VaultValidatorsQueryPayload['vaults'][number]['validators'][number]

type Validator = {
  apy: string
  link: string
  createdAt: number
  earned: ValidatorData['earned']
  publicKey: ValidatorData['publicKey']
}

export type Variables = VaultValidatorsQueryVariables

export type Input = VaultValidatorsQueryPayload

export type Output = Validator[]
