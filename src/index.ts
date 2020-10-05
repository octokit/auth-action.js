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

  const definitions = [
    process.env.GITHUB_TOKEN,
    process.env.INPUT_GITHUB_TOKEN,
    process.env.INPUT_TOKEN,
  ].filter(Boolean);

  if (definitions.length === 0) {
    throw new Error(
      "[@octokit/auth-action] `GITHUB_TOKEN` variable is not set. It must be set on either `env:` or `with:`. See https://github.com/octokit/auth-action.js#createactionauth"
    );
  }

  if (definitions.length > 1) {
    throw new Error(
      "[@octokit/auth-action] The token variable is specified more than once. Use either `with.token`, `with.GITHUB_TOKEN`, or `env.GITHUB_TOKEN`. See https://github.com/octokit/auth-action.js#createactionauth"
    );
  }

  const token = definitions.pop();
  return createTokenAuth(token as string);
};
