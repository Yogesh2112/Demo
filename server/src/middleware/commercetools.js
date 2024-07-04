const { createClient } = require("@commercetools/sdk-client");
const {
  createAuthMiddlewareForClientCredentialsFlow,
} = require("@commercetools/sdk-middleware-auth");
const { createHttpMiddleware } = require("@commercetools/sdk-middleware-http");
const fetch = require("node-fetch");

// Configure commercetools client
const projectKey = "handicraft";
const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: "https://auth.europe-west1.gcp.commercetools.com",
  projectKey,
  credentials: {
    clientId: "21x48HFhd6nzgt0F0sAZsnu4",
    clientSecret: "Y7MV6WwF9OpmzUuZELvtvo5jzKGUhGUT",
  },
  scopes: ["manage_project:handicraft"],
  fetch,
});
const httpMiddleware = createHttpMiddleware({
  host: "https://api.europe-west1.gcp.commercetools.com",
  fetch,
});
const client = createClient({
  middlewares: [authMiddleware, httpMiddleware],
});

module.exports = client;
