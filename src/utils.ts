interface NameWithOwner {
  owner: string
  repo: string
}

export function formatNameWithOwner({ owner, repo }: NameWithOwner): string {
  return `${owner}/${repo}`
}
