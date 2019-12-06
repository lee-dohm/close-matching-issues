import nock from 'nock'

import * as core from '@actions/core'
import * as github from '@actions/github'

import { getIssueNumbers } from '../src/main'

// Suppress printing of debug statements
jest.mock('@actions/core')

describe('getIssueNumbers', () => {
  let octokit, requestBody
  const mockToken = '1234567890abcdef'
  const testQuery = 'label:weekly-issue'

  beforeEach(() => {
    Object.assign(process.env, {
      GITHUB_REPOSITORY: 'test-owner/test-repo',
      GITHUB_ACTION: 'close-matching-issues'
    })

    octokit = new github.GitHub(mockToken)
  })

  it('returns the list of numbers', async () => {
    nock('https://api.github.com')
      .post('/graphql')
      .reply(200, (_, body) => {
        requestBody = body

        return {
          data: {
            search: {
              nodes: [
                {
                  number: 1219
                },
                {
                  number: 1213
                },
                {
                  number: 1207
                },
                {
                  number: 1198
                }
              ]
            }
          }
        }
      })

    const numbers = await getIssueNumbers(octokit, testQuery)

    expect(requestBody.variables.searchQuery).toBe(`repo:test-owner/test-repo ${testQuery}`)
    expect(numbers).toStrictEqual([1219, 1213, 1207, 1198])
  })

  it('returns an empty array when no numbers are returned', async () => {
    nock('https://api.github.com')
      .post('/graphql')
      .reply(200, (_, body) => {
        requestBody = body

        return {
          data: {
            search: {
              nodes: []
            }
          }
        }
      })

    const numbers = await getIssueNumbers(octokit, testQuery)

    expect(requestBody.variables.searchQuery).toBe(`repo:test-owner/test-repo ${testQuery}`)
    expect(numbers).toStrictEqual([])
  })
})
