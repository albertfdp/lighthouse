import GitHubApi from './GitHubPromisify'
import { getChangelog, getBranchName, upgradeDependency } from './utils'

export default class Repository {
  constructor (user, repo) {
    this.api = new GitHubApi(user, repo)
  }

  getPackageJson () {
    return new Promise((resolve, reject) => {
      this.api.getContent({ path: 'package.json' })
        .then(data => {
          try {
            resolve({
              ...data,
              content: new Buffer(data.content, 'base64').toString('utf8')
            })
          } catch (err) {
            reject(err)
          }
        })
    })
  }

  openPullRequest ({ title, body, branch, file }) {
    return Promise.resolve()
      .then(() => this.api.getReference({ ref: 'heads/master' }))
      .then((ref) => this.api.createReference({
        ref: `refs/heads/${branch}`,
        sha: ref.object.sha
      }))
      .then((ref) => this.api.updateFile({
        path: 'package.json',
        branch,
        message: title,
        sha: file.sha,
        content: new Buffer(file.content, 'utf8').toString('base64')
      }))
      .then((ref) => this.api.createPullRequest({
        title,
        body,
        base: 'master',
        head: branch
      }))
  }

  updateDependency (currentPackage, dependency) {
    const branch = getBranchName(dependency)
    const message = `Update ${dependency.name} to version ${dependency.version}`
    return Promise.resolve()
      .then(() => {
        const updated = upgradeDependency(JSON.parse(currentPackage.content), dependency)
        return Promise.resolve({
          ...currentPackage,
          content: JSON.stringify(updated, null, 2) + '\n'
        })
      })
      .then((updatedPackage) => {
        return Promise.resolve()
          .then(() => getChangelog(dependency.name, dependency.version, dependency.next))
          .then(changelog => {
            return this.openPullRequest({
              title: message,
              body: changelog,
              branch,
              file: updatedPackage
            })
          })
      })
  }
}
