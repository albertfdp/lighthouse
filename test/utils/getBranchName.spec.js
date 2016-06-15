import unexpected from 'unexpected'
const expect = unexpected.clone()

import { getBranchName } from '../../src/utils'

describe('getBranchName', () => {
  describe('when version includes problematic characters', () => {
    it('removes them from the branch name', () => {
      expect(
        getBranchName({ name: 'react', version: '^15.0.0' }),
        'to equal',
        'react-15.0.0'
      )
    })

    it('removes periods at the end from the branch name', () => {
      expect(
        getBranchName({ name: 'react', version: '^15.0.' }),
        'to equal',
        'react-15.0'
      )
    })
  })
})
