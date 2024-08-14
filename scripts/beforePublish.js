const { execSync } = require('child_process')
const package = require('../package.json')


const check = async () => {
  const npmVersion = package.version
  const releaseVersion = execSync(`git ls-remote https://github.com/stakewise/v3-sdk refs/tags/${npmVersion}`, { encoding: 'utf8' })

  if (package.version !== releaseVersion || !releaseVersion) {
    console.error(`Error: release version is ${npmVersion}, but should be ${package.version}`)
    process.exit(1)
  }
  else {
    process.exit(0)
  }
}

check()
