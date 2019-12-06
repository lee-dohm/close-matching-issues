# Close Matching Issues

A GitHub Action to close issues in the repo in which the Action executes that match a query.

## Use

Can be used to close issues that were opened by some previous workflow after they've served their purpose.

```yaml
steps:
  - uses: lee-dohm/close-matching-issues@v1
    with:
      query: 'label:weekly-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

* `query` -- GitHub search query that will match the issues that should be closed. **Note:** The search will automatically be scoped to the repository in which the Action is executing.
* `token` -- Token to use to perform the search and close the issues. `GITHUB_TOKEN` has sufficient access to do this.

## License

[MIT](LICENSE.md)
