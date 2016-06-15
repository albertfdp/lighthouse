import Promise from 'bluebird'
import GitHubApi from 'github'

export default class GitHubPromisify {
  constructor (user, repo) {
    this.user = user
    this.repo = repo
    this.api = new GitHubApi()
    this.api.authenticate({
      type: 'oauth',
      token: process.env.GITHUB_TOKEN
    })
  }

  getContent (config) {
    const { user, repo } = this
    return Promise.promisify(this.api.repos.getContent)({ ...config, user, repo })
  }

  updateFile (config) {
    const { user, repo } = this
    return Promise.promisify(this.api.repos.updateFile)({ ...config, user, repo })
  }

  createReference (config) {
    const { user, repo } = this
    return Promise.promisify(this.api.gitdata.createReference)({ ...config, user, repo })
  }

  getReference (config) {
    const { user, repo } = this
    return Promise.promisify(this.api.gitdata.getReference)({ ...config, user, repo })
  }

  createPullRequest (config) {
    const { user, repo } = this
    return Promise.promisify(this.api.pullRequests.create)({ ...config, user, repo })
  }

}
