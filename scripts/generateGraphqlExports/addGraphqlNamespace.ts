import fs from 'fs'

import string from './string'


const addGraphqlNamespace = (filePath: string, client: string) => {
  const graphqlTypesFile = fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line ? `  ${line}` : '')
    .join('\n')

  const graphqlTypesFileContent = [
    '// @ts-ignore',
    `export declare namespace ${string.capitalize(client)}Graph {\n`,
    graphqlTypesFile,
    '}',
    '',
  ].join('\n')

  fs.writeFileSync(filePath, graphqlTypesFileContent, 'utf8')
}


export default addGraphqlNamespace
