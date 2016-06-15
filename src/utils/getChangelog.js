import changelog from 'changelog'
import semver from 'semver'

const getChangelog = (name, prev, next) => {
  return Promise.resolve()
    .then(() => changelog.generate(name))
    .then(changes => {
      changes.versions = changes.versions
        .filter(version => {
          return !semver.outside(version.version, next, '<')
        })
      return changelog.markdown(changes)
    })
}

export default getChangelog
