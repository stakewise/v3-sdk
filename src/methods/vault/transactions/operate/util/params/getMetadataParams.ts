import { validateArgs } from '../../../../../../utils'
import { vaultMulticall } from '../../../../../../contracts'


export type SetMetadataParams = {
  metadataIpfsHash: string
}

const getMetadataParams = (values: SetMetadataParams) => {
  const { metadataIpfsHash } = values

  validateArgs.string({ metadataIpfsHash })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = [
    {
      method: 'setMetadata', args: [ metadataIpfsHash ],
    },
  ]

  return params
}


export default getMetadataParams

