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

  if (image) {
    validateArgs.image(image)
  }

  validateArgs.maxLength({
    displayName: { value: displayName, length: 30 },
    description: { value: description, length: 1000 },
  })

  validateArgs.string({ image, displayName, description })

  if (image || displayName || description) {
    try {
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
    catch (error) {
      const errorCode = Array.isArray(error) ? error[0]?.extensions?.code : null

      return Promise.reject(errorCode || error)
    }
  }

  return ''
}


export default uploadMetadata
