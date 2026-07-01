import * as z from 'zod/mini'

import graphql from '../../../../../../graphql'
import { apiUrls, schema, parseArgs } from '../../../../../../helpers'


export type UploadMetadataInput = {
  image?: string
  displayName?: string
  description?: string
}

const validateSchema = z.object({
  image: schema.image,
  displayName: schema.maxLength(30),
  description: schema.maxLength(1000),
})

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

  parseArgs(validateSchema, { image, displayName, description })

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
