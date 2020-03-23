import nock from 'nock'

import * as github from '@actions/github'

import { getIssueNumbers, GraphQlQueryResponseData } from '../src/main'

// Suppress printing of debug statements
jest.mock('@actions/core')

let requestBody: nock.Body

function graphqlNock(returnValue: GraphQlQueryResponseData): void {
  nock('https://api.github.com')
    .post('/graphql')
    .reply(200, (_, body) => {
      requestBody = body

      return returnValue
    })
}

describe('getIssueNumbers', () => {
  const mockToken = '1234567890abcdef'
  const testQuery = 'label:weekly-issue'

  let octokit: github.GitHub

  beforeEach(() => {
    Object.assign(process.env, {
      GITHUB_REPOSITORY: 'test-owner/test-repo',
      GITHUB_ACTION: 'close-matching-issues',
    })

    octokit = new github.GitHub(mockToken)
  })

  it('returns the list of numbers', async () => {
    graphqlNock({
      data: {
        search: {
          nodes: [
            {
              number: 1219,
            },
            {
              number: 1213,
            },
            {
              number: 1207,
            },
            {
              number: 1198,
            },
          ],
        },
      },
    })

    const numbers = await getIssueNumbers(octokit, testQuery)

    expect((requestBody as Record<string, any>).variables.searchQuery).toBe(
      `repo:test-owner/test-repo ${testQuery}`
    )
    expect(numbers).toStrictEqual([1219, 1213, 1207, 1198])
  })

  it('returns an empty array when no numbers are returned', async () => {
    graphqlNock({
      data: {
        search: {
          nodes: [],
        },
      },
    })

    const numbers = await getIssueNumbers(octokit, testQuery)

    expect((requestBody as Record<string, any>).variables.searchQuery).toBe(
      `repo:test-owner/test-repo ${testQuery}`
    )
    expect(numbers).toStrictEqual([])
  })
})
