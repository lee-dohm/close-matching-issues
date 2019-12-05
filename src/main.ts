import * as core from '@actions/core'
import * as github from '@actions/github'

const query = `
query($query: String!) {
  search(first: 100, query: $query, type: ISSUE) {
    nodes {
      ... on Issue {
        number
      }
    }
  }
}
`

async function closeIssues(octokit, numbers) {
  const context = github.context

  return numbers.map(async number => {
    core.debug(`Close https://github.com/${formatNameWithOwner(context.repo)}/issues/${number}`)

    return octokit.issues.update({ ...context.repo, issue_number: number, state: 'closed' })
  })
}

function formatNameWithOwner(repo) {
  return `${repo.owner}/${repo.repo}`
}

async function getIssueNumbers(octokit, searchQuery) {
  const context = github.context
  const queryText = `repo:${formatNameWithOwner(context.repo)} ${searchQuery}`

  core.debug(`Query: ${queryText}`)

  const { data: data } = await octokit.graphql(query, {
    query: queryText
  })

  return data.search.nodes.map(issue => issue.number)
}

async function run() {
  try {
    const token = core.getInput('token')

    if (!token) {
      throw new Error('`token` is a required input parameter')
    }

    const searchQuery = core.getInput('query')

    if (!searchQuery) {
      throw new Error('`query` is a required input parameter')
    }

    const octokit = new github.GitHub(token)

    const issueNumbers = await getIssueNumbers(octokit, searchQuery)

    await closeIssues(octokit, issueNumbers)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
