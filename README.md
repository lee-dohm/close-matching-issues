# Close Matching Issues Action

A GitHub Action to close issues matching a query.

## Code in Master

Install the dependencies
```bash
$ npm install
```

Build the typescript
```bash
$ npm run build
```

Run the tests :heavy_check_mark:
```bash
$ npm test

> typescript-action@0.0.0 test /Users/lee/Source/lee-dohm/close-matching-issues
> jest

 PASS  __tests__/main.test.ts
  ✓ fails when no token is supplied (160ms)
  ✓ fails when no query is supplied (125ms)

...
```

## Change action.yml

The action.yml contains defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
import * as core from '@actions/core';
...

async function run() {
  try {
      ...
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

## Publish to a distribution branch

Actions are run from GitHub repos.  We will create a releases branch and only checkin production modules (core in this case).

Comment out node_modules in .gitignore and create a releases/v1 branch

```bash
# comment out in distribution branches
# node_modules/
```

```bash
$ git checkout -b releases/v1
$ git commit -a -m "prod dependencies"
```

```bash
$ npm prune --production
$ git add node_modules
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing the releases/v1 branch

```yaml
uses: actions/typescript-action@releases/v1
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/javascript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and tested action

```yaml
uses: actions/typescript-action@v1
with:
  milliseconds: 1000
```

## License

[MIT](LICENSE.md)
