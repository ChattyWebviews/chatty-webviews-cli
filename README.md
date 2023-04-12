Chatty WebViews CLI
=================

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @azbouki/chatty-webviews-cli
$ chatty COMMAND
running command...
$ chatty (--version)
@azbouki/chatty-webviews-cli/0.0.0 darwin-arm64 node-v16.16.0
$ chatty --help [COMMAND]
USAGE
  $ chatty COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`chatty ci release`](#chatty-ci-release)
* [`chatty help [COMMANDS]`](#chatty-help-commands)
* [`chatty init`](#chatty-init)
* [`chatty release`](#chatty-release)

## `chatty ci release`

Relase a new version of a ChattyWebViews application or module from a CI/CD environment by passing all the required parameters

```
USAGE
  $ chatty ci release --version <value> [--name <value>] [--modules <value>]

FLAGS
  --modules=<value>...  Release only a set of modules by their names as specified in the `chatty-webviews.json` file.
  --name=<value>        Release name. Defaults to '' if not provided.
  --version=<value>     (required) Release version.

DESCRIPTION
  Relase a new version of a ChattyWebViews application or module from a CI/CD environment by passing all the required
  parameters

EXAMPLES
  $ chatty ci release --version 12.1

  $ chatty ci release --version 12.1 --name 'test release'

  $ chatty ci release --version 12.1 --name 'test release' --modules moduleA moduleB
```

## `chatty help [COMMANDS]`

Display help for chatty.

```
USAGE
  $ chatty help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for chatty.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.8/src/commands/help.ts)_

## `chatty init`

Initialize the configurations for a ChattyWebViews application

```
USAGE
  $ chatty init

DESCRIPTION
  Initialize the configurations for a ChattyWebViews application

EXAMPLES
  $ chatty init
```

_See code: [dist/commands/init/index.ts](https://github.com/vmutafov/hello-world/blob/v0.0.0/dist/commands/init/index.ts)_

## `chatty release`

Relase a new version of a ChattyWebViews application or module

```
USAGE
  $ chatty release

DESCRIPTION
  Relase a new version of a ChattyWebViews application or module

EXAMPLES
  $ chatty release
```

_See code: [dist/commands/release/index.ts](https://github.com/vmutafov/hello-world/blob/v0.0.0/dist/commands/release/index.ts)_
<!-- commandsstop -->
