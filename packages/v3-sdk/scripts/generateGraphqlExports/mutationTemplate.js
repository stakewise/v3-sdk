const mutationTemplate = `
type SubmitInput = {
  url: string
  variables: {QueryName}Variables
}

const submit{QueryName} = ({ url, variables }: SubmitInput) =>
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

module.exports = {
  mutationTemplate,
}
