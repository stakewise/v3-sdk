import fs from 'fs'
import path from 'path'


const removeOldFiles = (dirPath: string) => {
  const gqlFolders = fs.readdirSync(dirPath).filter((dirName: string) => !dirName.includes('.'))

  gqlFolders.forEach((gqlModelName: string) => {
    const gqlModelDir = path.resolve(dirPath, gqlModelName)

    const gqlFiles = fs.readdirSync(gqlModelDir)
      .filter((fileName: string) => /\.graphql$/.test(fileName))

    const typeFilesToRemove = fs.readdirSync(gqlModelDir)
      .filter((fileName: string) => {
        const isTypeFile = /\.graphql\.ts$/.test(fileName)
        const hasGqlFile = gqlFiles.includes(fileName.replace(/\.ts$/, ''))

        return isTypeFile && !hasGqlFile
      })

    if (gqlFiles.length) {
      typeFilesToRemove.forEach((typeFileName: string) => {
        const typeFile = path.resolve(gqlModelDir, typeFileName)

        console.log('remove file', typeFile)
        fs.rmSync(typeFile)
      })
    }
    else {
      console.log('remove dir', gqlModelDir)
      fs.rmSync(gqlModelDir, { recursive: true })
    }
  })
}


export default removeOldFiles
