import { formatNameWithOwner } from '../src/main'

describe('formatNameWithOwner', () => {
  it('formats the text correctly', () => {
    const text = formatNameWithOwner({ owner: 'owner-name', repo: 'repo-name' })

    expect(text).toBe('owner-name/repo-name')
  })
})
