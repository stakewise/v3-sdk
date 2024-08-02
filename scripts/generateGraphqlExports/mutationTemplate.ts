export default `
import { StakeWise{ClientName}Graph } from '../../../types/graphql/{clientName}'


type SubmitInput = {
  url: string
  variables: {QueryName}Variables
}

type Output = {
  data: {QueryName}Payload
  errors?: {
    path: string[]
    message: string
    extensions: {
      code: string
    }
  }[]
}

const submit{QueryName} = ({ variables, url }: SubmitInput) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    })
  })
    .then((res) => res.json() as Promise<Output>)
    .then(({ data, errors }) => {
      if (!errors) {
        return data
      }
      
      return Promise.reject(errors)
    })
`
