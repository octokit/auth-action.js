import { createTokenAuth, Types as AuthTokenTypes } from "@octokit/auth-token";

import { StrategyInterface } from "@octokit/types";

export type Types = {
  StrategyOptions: never;
  AuthOptions: never;
  Authentication: AuthTokenTypes["Authentication"];
};

export const createActionAuth: StrategyInterface<
  [],
  [],
  Types["Authentication"]
> = function createActionAuth() {
  if (!process.env.GITHUB_ACTION) {
    throw new Error(
      "[@octokit/auth-action] `GITHUB_ACTION` environment variable is not set. @octokit/auth-action is meant to be used in GitHub Actions only."
    );
  }

  if (!process.env.GITHUB_TOKEN && !process.env.INPUT_GITHUB_TOKEN) {
    throw new Error(
      "[@octokit/auth-action] `GITHUB_TOKEN` variable is not set. It must be set on either `env:` or `with:`. See https://github.com/octokit/auth-action.js#createactionauth"
    );
  }

  if (process.env.GITHUB_TOKEN && process.env.INPUT_GITHUB_TOKEN) {
    throw new Error(
      "[@octokit/auth-action] `GITHUB_TOKEN` variable is set on both `env:` and `with:`. Use either the one or the other. See https://github.com/octokit/auth-action.js#createactionauth"
    );
  }

  const token = process.env.GITHUB_TOKEN || process.env.INPUT_GITHUB_TOKEN
  return createTokenAuth(token as string);
};
