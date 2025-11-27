import graphql from '../../../../../../graphql'
import { apiUrls, validateArgs } from '../../../../../../helpers'


export type UploadMetadataInput = {
  image?: string
  displayName?: string
  description?: string
}

type Input = UploadMetadataInput & StakeWise.CommonParams

const uploadMetadata = async (values: Input) => {
  const skip = [
    values.image,
    values.displayName,
    values.description,
  ]
    .every((value) => typeof value === 'undefined')

  if (skip) {
    return
  }

  const { image = '', displayName = '', description = '', options } = values

  validateArgs.string({ image, displayName, description })

  validateArgs.image(image)

  validateArgs.maxLength({
    displayName: { value: displayName, length: 30 },
    description: { value: description, length: 1000 },
  })

  if (!image && !displayName && !description) {
    return ''
  }

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


export default uploadMetadata
