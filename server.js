const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("express-jwt");
require("dotenv").config();
const typeDefs = require("./schemas");
const resolvers = require("./resolvers");
const formatError = require("./errors");

const port = 4000;
const path = "/api";
const app = express();

const errorName = formatError.errorName;

app.use(
  path,
  jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    user: req.user,
    errorName
  }),
  formatError: err => {
    return formatError.getError(err);
  }
});

server.applyMiddleware({ app, path });

app.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);
