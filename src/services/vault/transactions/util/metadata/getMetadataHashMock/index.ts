type Input = {
  image?: string
  displayName?: string
  description?: string
}


const getMetadataHashMock = ({ image, displayName, description }: Input) => {
  if (image || displayName || description) {
    return '00000000000000000000000000000000000000000000000000000000000'
  }

  return ''
}


export default getMetadataHashMock
