import { request } from "@octokit/request";
import fetchMock, { MockMatcherFunction } from "fetch-mock";

import { createActionAuth } from "../src/index";

afterEach(() => {
  delete process.env.GITHUB_ACTION;
  delete process.env.GITHUB_TOKEN;
  delete process.env.INPUT_GITHUB_TOKEN;
  delete process.env.INPUT_TOKEN;
});

test("README example", async () => {
  process.env.GITHUB_ACTION = "my-action";
  process.env.GITHUB_TOKEN = "v1.1234567890abcdef1234567890abcdef12345678";

  const auth = createActionAuth();
  const authentication = await auth();

  expect(authentication).toEqual({
    type: "token",
    token: "v1.1234567890abcdef1234567890abcdef12345678",
    tokenType: "installation",
  });
});

test("README example using with:", async () => {
  process.env.GITHUB_ACTION = "my-action";
  process.env.INPUT_GITHUB_TOKEN =
    "v1.1234567890abcdef1234567890abcdef12345678";

  const auth = createActionAuth();
  const authentication = await auth();

  expect(authentication).toEqual({
    type: "token",
    token: "v1.1234567890abcdef1234567890abcdef12345678",
    tokenType: "installation",
  });
});

test("README example using with.token", async () => {
  process.env.GITHUB_ACTION = "my-action";
  process.env.INPUT_TOKEN = "v1.1234567890abcdef1234567890abcdef12345678";

  const auth = createActionAuth();
  const authentication = await auth();

  expect(authentication).toEqual({
    type: "token",
    token: "v1.1234567890abcdef1234567890abcdef12345678",
    tokenType: "installation",
  });
});

test("GITHUB_ACTION not set", async () => {
  try {
    const auth = createActionAuth();
    throw new Error("Should not resolve");
  } catch (error: any) {
    expect(error.message).toMatch(
      /\[@octokit\/auth-action\] `GITHUB_ACTION` environment variable is not set/i
    );
  }
});

test("both GITHUB_TOKEN and INPUT_GITHUB_TOKEN set", async () => {
  process.env.GITHUB_ACTION = "my-action";
  process.env.GITHUB_TOKEN = "v1.1234567890abcdef1234567890abcdef12345678";
  process.env.INPUT_GITHUB_TOKEN =
    "v1.1234567890abcdef1234567890abcdef12345678";

  try {
    const auth = createActionAuth();
    throw new Error("Should not resolve");
  } catch (error: any) {
    expect(error.message).toMatch(
      /\[@octokit\/auth-action\] The token variable is specified more than once/i
    );
  }
});

test("both GITHUB_TOKEN and INPUT_TOKEN set", async () => {
  process.env.GITHUB_ACTION = "my-action";
  process.env.GITHUB_TOKEN = "v1.1234567890abcdef1234567890abcdef12345678";
  process.env.INPUT_TOKEN = "v1.1234567890abcdef1234567890abcdef12345678";

  try {
    const auth = createActionAuth();
    throw new Error("Should not resolve");
  } catch (error: any) {
    expect(error.message).toMatch(
      /\[@octokit\/auth-action\] The token variable is specified more than once/i
    );
  }
});

test("GITHUB_TOKEN and INPUT_GITHUB_TOKEN not set", async () => {
  process.env.GITHUB_ACTION = "my-action";

  try {
    const auth = createActionAuth();
    throw new Error("Should not resolve");
  } catch (error: any) {
    expect(error.message).toMatch(
      /\[@octokit\/auth-action\] `GITHUB_TOKEN` variable is not set/i
    );
  }
});

test('auth.hook(request, "GET /user")', async () => {
  process.env.GITHUB_ACTION = "my-action";
  process.env.GITHUB_TOKEN = "v1.1234567890abcdef1234567890abcdef12345678";

  const expectedRequestHeaders = {
    accept: "application/vnd.github.v3+json",
    authorization: "token v1.1234567890abcdef1234567890abcdef12345678",
    "user-agent": "test",
  };

  const matchGetUser: MockMatcherFunction = (url, { body, headers }) => {
    expect(url).toEqual("https://api.github.com/user");
    expect(headers).toStrictEqual(expectedRequestHeaders);
    return true;
  };

  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: fetchMock.sandbox().getOnce(matchGetUser, { id: 123 }),
    },
  });

  const { hook } = createActionAuth();
  const { data } = await hook(requestMock, "GET /user");

  expect(data).toStrictEqual({ id: 123 });
});
