import yargs from 'yargs'
import { version } from '../package'

import { createDependencies } from './utils'

import ncu from 'npm-check-updates'
import Repository from './Repository'

const argv = yargs
  .usage('Usage: lighthouse -r [url]')
  .alias('v', 'version')
  .version(() => version)
  .alias('h', 'help')
  .help('help')
  .boolean('dry')
  .alias('r', 'repo')
  .alias('u', 'user')
  .demand([ 'r', 'u' ])
  .describe('dry', 'DRY run')
  .describe('r', 'The repository name')
  .describe('u', 'The user or organization name')
  .argv

const repo = new Repository(argv.user, argv.repo, argv.dry)
Promise.resolve()
  .then(() => repo.getPackageJson())
  .then((currentPackage) => {
    let currentDependencies = createDependencies(JSON.parse(currentPackage.content))

    return ncu.run({ packageData: currentPackage.content })
      .then((upgraded) => {
        let nextDependencies = []

        Object.keys(upgraded).forEach(u => {
          let dependency = currentDependencies.get(u)
          dependency.updateTo(upgraded[u])

          nextDependencies.push(dependency)
        })

        console.log(`There are ${nextDependencies.length} that can be updated`)
        return Promise.resolve(nextDependencies)
      })
      .then((dependencies) => {
        let promises = []

        dependencies.forEach(dependency => {
          console.log(`Processing: ${dependency.name}@${dependency.next}`)
          promises.push(repo.updateDependency(currentPackage, dependency))
        })

        return Promise.all(promises)
      })
      .catch(err => console.error(err))
  })
  .catch(err => console.error(err))
