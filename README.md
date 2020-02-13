# Close Matching Issues

A GitHub Action to close issues in the repo in which the Action executes that match a query.

## Use

Can be used to close issues or pull requests that were opened by some previous workflow after they've served their purpose.

```yaml
steps:
  - uses: lee-dohm/close-matching-issues@v1
    with:
      query: 'label:weekly-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

* `query` **required** -- [GitHub search query](https://help.github.com/github/searching-for-information-on-github/searching-issues-and-pull-requests) that will match the issues that should be closed. **Note:** The search will automatically be scoped to the repository in which the Action is executing.
* `token` **required** -- Token to use to perform the search and close the issues. `GITHUB_TOKEN` has sufficient access to do this.

## License

[MIT](LICENSE.md)
