type FaucetMutationVariables = BackendGraph.Exact<{
  address: BackendGraph.Scalars['String']
  amount: BackendGraph.Scalars['Decimal']
}>
type FaucetMutationPayload = { faucet: { message: string, code: string, value: string } | { txHash: string } }


const query = 'mutation Faucet ( $address: String!, $amount: Decimal!) { faucet( payload: { address: $address, amount: $amount } ) { ...on FaucetError { message code value } ...on FaucetStatus { txHash } }}'

type SubmitInput = {
  url: string
  variables: FaucetMutationVariables
}

const submitFaucetMutation = ({ url, variables }: SubmitInput) =>
  fetch(url, {
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
