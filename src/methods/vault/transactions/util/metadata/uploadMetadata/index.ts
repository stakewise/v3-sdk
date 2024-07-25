import graphql from '../../../../../../graphql'
import { apiUrls, validateArgs } from '../../../../../../utils'


export type UploadMetadataInput = {
  image?: string
  displayName?: string
  description?: string
}

type Input = UploadMetadataInput & {
  options: StakeWise.Options
}

const uploadMetadata = async (input: Input) => {
  const { image = '', displayName = '', description = '', options } = input

  validateArgs.string({ image, displayName, description })

  if (image || displayName || description) {
    const data = await graphql.backend.vault.submitUploadMetadataMutation({
      url: apiUrls.getBackendUrl(options),
      variables: {
        payload: {
          image,
          displayName,
          description,
        },
      },
    })

    return data?.uploadMetadata?.ipfsHash
  }

  return null
}


export default uploadMetadata
