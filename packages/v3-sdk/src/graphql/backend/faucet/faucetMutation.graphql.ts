type FaucetMutationVariables = BackendGraph.Exact<{
  address: BackendGraph.Scalars['String']['input']
  amount: BackendGraph.Scalars['Decimal']['input']
}>
type FaucetMutationPayload = { faucet: { message: string, code: string, value: string } | { txHash: string } }


const query = 'mutation Faucet ( $address: String!, $amount: Decimal!) { faucet( payload: { address: $address, amount: $amount } ) { ...on FaucetError { message code value } ...on FaucetStatus { txHash } }}'

import constants from '../../../constants'


type SubmitInput = {
  variables: FaucetMutationVariables
}

const submitFaucetMutation = ({ variables }: SubmitInput) =>
  fetch(constants.url.backend, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    })
  })
    .then((res) => res.json() as Promise<{ data: FaucetMutationPayload }>)
    .then(({ data }) => data)


export { submitFaucetMutation }
export type { FaucetMutationPayload, FaucetMutationVariables }
