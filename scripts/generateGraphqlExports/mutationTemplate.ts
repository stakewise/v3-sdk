export default `
import { constants, Network } from 'helpers'
import { {ClientName}Graph } from 'types/graphql/{clientName}'


type SubmitInput = {
  network: Network
  variables: {QueryName}Variables
}

const submit{QueryName} = ({ variables, network }: SubmitInput) =>
  fetch(constants.urls[network].{clientName}, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    })
  })
    .then((res) => res.json() as Promise<{ data: {QueryName}Payload }>)
    .then(({ data }) => data)
`
