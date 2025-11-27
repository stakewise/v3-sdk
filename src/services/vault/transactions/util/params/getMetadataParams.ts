import { vaultMulticall } from '../../../../../contracts'


export type SetMetadataParams = {
  metadataIpfsHash: string
}

const getMetadataParams = (values: SetMetadataParams) => {
  const { metadataIpfsHash } = values

  // ATTN we don't validate `metadataIpfsHash` because it is not provided by user
  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setMetadata', args: [ metadataIpfsHash ],
    },
  ]

  return params
}


export default getMetadataParams

