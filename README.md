# release-npm-action

<img align="right" src="https://github.com/tobua/release-npm-action/raw/main/logo.png" width="20%" alt="release-npm-action" />

GitHub action to version and document a plugin release to npm using [semantic-release](https://github.com/semantic-release/semantic-release).

- Creates tag for current version.
- GitHub release for tag with release notes based on commit messages.
- Publishes release to npm.
- Release triggered through `release-npm` commit annotation or manual run.
- No additional commits made.
- No version required in `package.json`.
- No project dependencies necessary.

## Usage

Add steps to build and test before the release as usual.

```yaml
name: release

# Runs always on commits, will only release when requested, see below.
on:
  push:
    branches: [main]

jobs:
  test:
    # test step if necessary
  release:
    # needs: [test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      # run build if necessary
      - uses: tobua/release-npm-action@v1
        with:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Request Release

### `release-npm` in Commit Body

To request the next commit to be released if the pipeline passes add a remark to the commit message.

```
feat(component): implement swipe and dot functionality for Intro

release-npm
```

If a `release-npm` token is found in the body a release will be triggered. Patch, minor or major release type will be decided based on the commit history.

```
fix(component): improve swipe behavior [release-npm]
```

The annotation can be placed anywhere in the commit message.

### Manually Triggered Workflow

Alternatively, a release can be manually triggered without annotated commits. This requires the action to run on the `workflow_dispatch` trigger. When that is added a workflow can be triggered from the GitHub workflow UI for this action. The UI dialogue will prompt for an input which is set to 'regular' by default and when submitted with this value will trigger a manual release.

```yaml
name: push

# Runs always on commits, will only release when requested, see below.
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      manual:
        description: Manually trigger regular release?
        default: regular
        required: true

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      # ...
      - uses: tobua/release-npm-action@v0
        with:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          # Hand over manual input trigger.
          MANUAL_TRIGGER: ${{ github.event.inputs.manual }}
```

## Options / Inputs

The following options can be passed to the action.

| Option         | Values    | Required | Description                                                |
| -------------- | --------- | -------- | ---------------------------------------------------------- |
| NPM_TOKEN      | string    | true     | npm Automation or Publishing token.                        |
| GITHUB_TOKEN   | string    | true     | GitHub token automatically created by GitHub.              |
| MANUAL_TRIGGER | 'regular' | false    | Manually trigger a release even without commit annotation. |
| CHANNEL        | string    | false    | dist-tag to publish the npm release on, default latest.    |
| DRY_RUN        | 'true'    | false    | Release in dry mode (no publish).                          |
| DEBUG          | 'true'    | false    | Run in debug mode.                                         |

`version`, `channel` and `tag` are available as output variables after a successful release.

## Caveats

The first version for a plugin release defaults to `1.0.0` and cannot be changed. The next version is based on the commit history since the latest release and also cannot be changed.

## Troubleshooting

If you run into any issues with the action the likely cause is with `semantic-release`. You can try it out locally by running `npx semantic-release --branches main --dry-run --no-ci` without publishing anything.
