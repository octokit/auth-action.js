import { createTokenAuth } from "@octokit/auth-token";

export function createActionAuth() {
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
}
