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

  if (!process.env.GITHUB_TOKEN) {
    throw new Error(
      "[@octokit/auth-action] `GITHUB_TOKEN` environment variable is not set. See https://help.github.com/en/articles/virtual-environments-for-github-actions#github_token-secret"
    );
  }

  return createTokenAuth(process.env.GITHUB_TOKEN);
};
