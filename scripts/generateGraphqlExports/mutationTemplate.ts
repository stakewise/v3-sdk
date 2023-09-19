export default `
import configs from 'helpers/configs'
import { Network } from 'helpers/enums'
import { {ClientName}Graph } from 'types/graphql/{clientName}'


type SubmitInput = {
  network: Network
  variables: {QueryName}Variables
}

const submit{QueryName} = ({ variables, network }: SubmitInput) =>
  fetch(configs[network].api.{clientName}, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    })
  })
    .then((res) => res.json() as Promise<{ data: {QueryName}Payload }>)
    .then(({ data }) => data)
`
