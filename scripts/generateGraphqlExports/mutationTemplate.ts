export default `
import { constants } from 'helpers'


type SubmitInput = {
  variables: {QueryName}Variables
}

const submit{QueryName} = ({ variables }: SubmitInput) =>
  fetch(constants.url.{clientName}, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    })
  })
    .then((res) => res.json() as Promise<{ data: {QueryName}Payload }>)
    .then(({ data }) => data)
`
