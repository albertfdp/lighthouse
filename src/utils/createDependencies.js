import Dependency from '../Dependency'

const DEPENDENCY_ENUM = [ 'dependencies', 'peerDependencies', 'devDependencies' ]

const getDepsForType = (data, type) => {
  return Object.keys(data[type]).map(name => {
    return new Dependency({
      name,
      version: data[type][name],
      type
    })
  })
}

const createDependencies = (data) => {
  let dependencies = [ 'dependencies', 'peerDependencies', 'devDependencies' ]
    .map(type => {
      if (!(type in data)) { return }
      return getDepsForType(data, type)
    }).filter(item => typeof item !== 'undefined')
  let flatten = [].concat.apply([], dependencies)

  let mapDependencies = new Map(flatten.map(dependency => {
    return [ dependency.name, dependency ]
  }))

  return mapDependencies
}

export default createDependencies
