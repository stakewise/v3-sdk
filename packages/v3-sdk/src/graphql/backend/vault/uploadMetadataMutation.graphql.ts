type UploadMetadataMutationVariables = BackendGraph.Exact<{
  payload: BackendGraph.PayloadType
}>
type UploadMetadataMutationPayload = { uploadMetadata: { ipfsHash: string } }


const query = 'mutation UploadMetadata ( $payload: PayloadType!) { uploadMetadata( payload: $payload ) { ipfsHash }}'

type SubmitInput = {
  url: string
  variables: UploadMetadataMutationVariables
}

const submitUploadMetadataMutation = ({ url, variables }: SubmitInput) =>
  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    })
  })
    .then((res) => res.json() as Promise<{ data: UploadMetadataMutationPayload }>)
    .then(({ data }) => data)


export { submitUploadMetadataMutation }
export type { UploadMetadataMutationPayload, UploadMetadataMutationVariables }

