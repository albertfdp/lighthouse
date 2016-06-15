import unexpected from 'unexpected'
const expect = unexpected.clone()

import { upgradeDependency } from '../../src/utils'

describe('upgradeDependency', () => {
  let pkgData
  beforeEach(() => {
    pkgData = require('./package.json')
  })

  describe('when a dependency is a production dependency', () => {
    it('is updated on package.json correctly', () => {
      const updated = upgradeDependency(pkgData, ({ name: 'react', version: '^15.0.0' }))
      expect(
        updated.dependencies['react'],
        'to equal',
        '^15.0.0'
      )
    })
  })

  describe('when a dependency is a devDependency', () => {
    it('is updated on package.json correctly', () => {
      const updated = upgradeDependency(pkgData, ({ name: 'babel', version: '5.9.34' }))
      expect(
        updated.devDependencies['babel'],
        'to equal',
        '5.9.34'
      )
    })
  })

  describe('when a dependency is a peerDependency', () => {
    it('is updated on package.json correctly', () => {
      const updated = upgradeDependency(pkgData, ({ name: 'someDependency', version: '^9.0' }))
      expect(
        updated.peerDependencies['someDependency'],
        'to equal',
        '^9.0'
      )
    })
  })
})
