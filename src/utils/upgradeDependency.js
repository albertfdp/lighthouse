const upgradeDependency = (data, { name, version }) => {
  const { dependencies, devDependencies, peerDependencies } = data

  if (Object.keys(dependencies).includes(name)) {
    data.dependencies[name] = version
  } else if (Object.keys(devDependencies).includes(name)) {
    data.devDependencies[name] = version
  } else if (Object.keys(peerDependencies).includes(name)) {
    data.peerDependencies[name] = version
  }

  return data
}

export default upgradeDependency
