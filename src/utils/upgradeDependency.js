const upgradeDependency = (data, { name, version }) => {
  const { dependencies, devDependencies } = data

  if (Object.keys(dependencies).includes(name)) {
    data.dependencies[name] = version
  } else if (Object.keys(dependencies).includes(name)) {
    data.devDependencies[name] = version
  }

  return data
}

export default upgradeDependency
