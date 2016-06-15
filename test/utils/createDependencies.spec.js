import unexpected from 'unexpected'
const expect = unexpected.clone()

import Dependency from '../../src/Dependency'
import { createDependencies } from '../../src/utils'

describe('createDependencies', () => {
  let pkgData
  beforeEach(() => {
    pkgData = require('./package.json')
  })

  describe('when a package is passed', () => {
    it('builds an array of dependencies', () => {
      const dependencyMap = createDependencies(pkgData)
      expect(
        dependencyMap,
        'to satisfy',
        new Map([
          new Dependency({ name: 'lodash', version: '3.10.1', type: 'dependencies' }),
          new Dependency({ name: 'someDependency', version: '^7.0 || ^8.0', type: 'peerDependencies' }),
          new Dependency({ name: 'babel-core', version: '^5.4.7', type: 'devDependencies' })
        ])
      )
    })
  })
})
