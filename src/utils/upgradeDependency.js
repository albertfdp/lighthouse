const upgradeDependency = (data, { name, next }) => {
  const { dependencies, devDependencies, peerDependencies } = data

  if (Object.keys(dependencies).includes(name)) {
    data.dependencies[name] = next
  } else if (Object.keys(devDependencies).includes(name)) {
    data.devDependencies[name] = next
  } else if (Object.keys(peerDependencies).includes(name)) {
    data.peerDependencies[name] = next
  }

  return data
}

export default upgradeDependency
