import nock from 'nock'

import * as github from '@actions/github'

import { getIssueNumbers, GitHubClient, GraphQlQueryResponseData } from '../src/main'

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
  const issueTestQuery = 'type:issue label:weekly-issue'
  const prTestQuery = 'type:pr label:monthly-rollup'

  let octokit: GitHubClient

  beforeEach(() => {
    Object.assign(process.env, {
      GITHUB_REPOSITORY: 'test-owner/test-repo',
      GITHUB_ACTION: 'close-matching-issues',
    })

    octokit = github.getOctokit(mockToken)
  })

  it('returns the list of numbers for issues', async () => {
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

    const numbers = await getIssueNumbers(octokit, issueTestQuery)

    expect((requestBody as Record<string, any>).variables.searchQuery).toBe(
      `repo:test-owner/test-repo ${issueTestQuery}`
    )
    expect(numbers).toStrictEqual([1219, 1213, 1207, 1198])
  })

  it('returns the list of numbers for pull requests', async () => {
    graphqlNock({
      data: {
        search: {
          nodes: [
            {
              number: 1912,
            },
            {
              number: 1312,
            },
            {
              number: 1702,
            },
            {
              number: 1891,
            },
          ],
        },
      },
    })

    const numbers = await getIssueNumbers(octokit, prTestQuery)

    expect((requestBody as Record<string, any>).variables.searchQuery).toBe(
      `repo:test-owner/test-repo ${prTestQuery}`
    )
    expect(numbers).toStrictEqual([1912, 1312, 1702, 1891])
  })

  it('returns an empty array when no numbers are returned', async () => {
    graphqlNock({
      data: {
        search: {
          nodes: [],
        },
      },
    })

    const numbers = await getIssueNumbers(octokit, issueTestQuery)

    expect((requestBody as Record<string, any>).variables.searchQuery).toBe(
      `repo:test-owner/test-repo ${issueTestQuery}`
    )
    expect(numbers).toStrictEqual([])
  })
})
