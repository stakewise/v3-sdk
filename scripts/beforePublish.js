import { execSync } from 'child_process'
import pkg from '../package.json' with { type: 'json' }


const check = async () => {
  const npmVersion = pkg.version
  const releaseVersion = execSync(`git ls-remote https://github.com/AlexGavrilov939/stakewise-v3-sdk-cjs refs/tags/${npmVersion}`, { encoding: 'utf8' })
    .replace(/.*\//, '')
    .trim()

  if (npmVersion !== releaseVersion || !releaseVersion) {
    console.error(`Please add ${npmVersion} release to Github https://github.com/AlexGavrilov939/stakewise-v3-sdk-cjs/releases/new`)
    process.exit(1)
  }
  else {
    process.exit(0)
  }
}

check()
