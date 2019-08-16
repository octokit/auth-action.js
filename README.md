# auth-action.js

> GitHub API token authentication for GitHub Actions

[![@latest](https://img.shields.io/npm/v/@octokit/auth-action.svg)](https://www.npmjs.com/package/@octokit/auth-action)
[![Build Status](https://travis-ci.com/octokit/auth-action.js.svg?branch=master)](https://travis-ci.com/octokit/auth-action.js)
[![Greenkeeper](https://badges.greenkeeper.io/octokit/auth-action.js.svg)](https://greenkeeper.io/)

`@octokit/auth-action` is one of [GitHub’s authentication strategies](https://github.com/octokit/auth.js).

It does not require any configuration, but instead reads [the `GITHUB_TOKEN` environment variable](https://help.github.com/en/articles/virtual-environments-for-github-actions#github_token-secret) that is provided to GitHub Actions.

<!-- toc -->

- [Usage](#usage)
- [`createActionAuth()`](#createactionauth)
- [`auth()`](#auth)
- [Authentication object](#authentication-object)
- [`auth.hook(request, route, options)` or `auth.hook(request, options)`](#authhookrequest-route-options-or-authhookrequest-options)
- [Find more information](#find-more-information)
- [License](#license)

<!-- tocstop -->

## Usage

Install with <code>npm install @octokit/auth-action</code>

```js
const { createActionAuth } = require("@octokit/auth-action");
// or: import { createActionAuth } from "@octokit/auth-action";

const auth = createActionAuth();
const authentication = await auth();
// {
//   type: 'token',
//   token: 'v1.1234567890abcdef1234567890abcdef12345678',
//   tokenType: 'oauth'
// }
```

## `createActionAuth()`

The `createActionAuth()` method has no options.

It expects the `GITHUB_TOKEN` environment variable to be set which is provided to GitHub Actions, but [has to be configured explicitly](https://help.github.com/en/articles/virtual-environments-for-github-actions#github_token-secret).

`GITHUB_TOKEN` can be set to any of the repository's secret, e.g. if you want to use a personal access token.

```yml
steps:
  - name: My first action
    env:
      GITHUB_TOKEN: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

`createActionAuth()` is also checking for the `GITHUB_ACTION` variable to be present to make sure that it runs within a GitHub Action.

If either `GITHUB_ACTION` or `GITHUB_TOKEN` is not set an error is thrown.

## `auth()`

The `auth()` method has no options. It returns a promise which resolves with the the authentication object.

## Authentication object

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>type</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <code>"token"</code>
      </td>
    </tr>
    <tr>
      <th>
        <code>token</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        The provided token.
      </td>
    </tr>
    <tr>
      <th>
        <code>tokenType</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        Can be either <code>"oauth"</code> for personal access tokens and OAuth tokens, or <code>"installation"</code> for installation access tokens (includes <code>GITHUB_TOKEN</code> provided to GitHub Actions)
      </td>
    </tr>
  </tbody>
</table>

## `auth.hook(request, route, options)` or `auth.hook(request, options)`

`auth.hook()` hooks directly into the request life cycle. It authenticates the request using the provided token.

The `request` option is an instance of [`@octokit/request`](https://github.com/octokit/request.js#readme). The `route`/`options` parameters are the same as for the [`request()` method](https://github.com/octokit/request.js#request).

`auth.hook()` can be called directly to send an authenticated request

```js
const { data: authorizations } = await auth.hook(
  request,
  "GET /authorizations"
);
```

Or it can be passed as option to [`request()`](https://github.com/octokit/request.js#request).

```js
const requestWithAuth = request.defaults({
  request: {
    hook: auth.hook
  }
});

const { data: authorizations } = await requestWithAuth("GET /authorizations");
```

## Find more information

`auth()` does not send any requests, it only retrieves the token from the environment variable and transforms the provided token string into an authentication object.

The `GITHUB_TOKEN` provided to GitHub Actions is an installation token with all permissions provided. You can use it for `git` commands, too. Learn more about the differences in token authentication at [@octokit/auth-action](https://github.com/octokit/auth-action.js#find-more-information).

## License

[MIT](LICENSE)
