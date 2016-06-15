import GitHubApi from './GitHubPromisify'
import { getBranchName, upgradeDependency } from './utils'

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

  updateDependency (dependency) {
    const branch = getBranchName(dependency)
    const message = `Update ${dependency.name} to version ${dependency.version}`
    return this.getPackageJson()
      .then((data) => {
        const updated = upgradeDependency(JSON.parse(data.content), dependency)
        return Promise.resolve({
          ...data,
          content: JSON.stringify(updated, null, 2) + '\n'
        })
      })
      .then((data) => {
        return this.api.getReference({ ref: 'heads/master' })
          .then((ref) => this.api.createReference({
            ref: `refs/heads/${branch}`,
            sha: ref.object.sha
          }))
          .then((ref) => this.api.updateFile({
            path: 'package.json',
            branch,
            message,
            sha: data.sha,
            content: new Buffer(data.content, 'utf8').toString('base64')
          }))
          .then((ref) => this.api.createPullRequest({
            title: message,
            body: 'The body',
            base: 'master',
            head: branch
          }))
      })
  }
}
