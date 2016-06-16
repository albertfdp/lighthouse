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
    .catch(err => {
      if (process.env.NODE_DEBUG) {
        console.error(`Something went wrong with changelog => ${err}`)
      }
      const fallback = `Updated ${name} from ${prev} to ${next}`
      return Promise.resolve(fallback)
    })
}

export default getChangelog
