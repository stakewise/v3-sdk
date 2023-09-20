export default `
import { {ClientName}Graph } from 'types/graphql/{clientName}'


type SubmitInput = {
  url: string
  variables: {QueryName}Variables
}

const submit{QueryName} = ({ variables, url }: SubmitInput) =>
  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    })
  })
    .then((res) => res.json() as Promise<{ data: {QueryName}Payload }>)
    .then(({ data }) => data)
`
