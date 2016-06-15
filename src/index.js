import yargs from 'yargs'
import { version } from '../package'

import ncu from 'npm-check-updates'
import Dependency from './Dependency'
import Repository from './Repository'

const argv = yargs
  .usage('Usage: lighthouse -r [url]')
  .alias('v', 'version')
  .version(() => version)
  .alias('h', 'help')
  .help('help')
  .alias('r', 'repo')
  .alias('u', 'user')
  .demand([ 'r', 'u' ])
  .describe('r', 'The repository name')
  .describe('u', 'The user or organization name')
  .argv

const repo = new Repository(argv.user, argv.repo)
repo.getPackageJson()
  .then((data) => ncu.run({ packageData: data.content }))
  .then((upgraded) => {
    return Promise.resolve(Object.keys(upgraded).map(u => (
      new Dependency({ name: u, version: upgraded[u] })
    )))
  })
  .then((dependencies) => Promise.resolve([ dependencies[0] ]))
  .then((dependencies) => {
    let promises = []

    dependencies.forEach(dependency => {
      console.log(`Processing: ${dependency.name}@${dependency.version}`)
      promises.push(repo.updateDependency(dependency))
    })

    return Promise.all(promises)
  })
  .then((updated) => {
    console.log(updated)
  })
  .catch(e => console.error(e))
