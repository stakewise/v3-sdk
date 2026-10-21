type Input = {
  image?: string
  displayName?: string
  description?: string
}


const getMetadataHashMock = ({ image, displayName, description }: Input) => {
  const values = [ image, displayName, description ]

  if (values.every((value) => typeof value === 'undefined')) {
    return
  }

  if (values.some(Boolean)) {
    return '00000000000000000000000000000000000000000000000000000000000'
  }

  return ''
}


export default getMetadataHashMock
