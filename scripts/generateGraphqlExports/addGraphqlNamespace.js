const fs = require('fs')

const string = require('./string')


const addGraphqlNamespace = (filePath, client) => {
  const graphqlTypesFile = fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line ? `  ${line}` : '')
    .join('\n')

  const graphqlTypesFileContent = [
    '// @ts-ignore',
    `declare namespace ${string.capitalize(client)}Graph {\n`,
    graphqlTypesFile,
    '}',
    '',
  ].join('\n')

  fs.writeFileSync(filePath, graphqlTypesFileContent, 'utf8')
}


module.exports = addGraphqlNamespace
