const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
require("dotenv").config();
const typeDefs = require("./schemas");
const resolvers = require("./resolvers");
const formatError = require("./errors");
const { verifyJWT_MW } = require("./utils");

const port = 4000;
const path = "/api";
const app = express();

const errorName = formatError.errorName;

app.use(cors());

app.use(verifyJWT_MW);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    user: req.decodedToken,
    errorName,
  }),
  formatError: (err) => {
    return formatError.getError(err);
  },
});

server.applyMiddleware({ app, path });

app.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);
