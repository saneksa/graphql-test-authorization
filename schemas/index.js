const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: Int!
    firstName: String!
    secondName: String!
    email: String!
  }

  type Login {
    token: String
    user: User
  }

  type CurrentUser {
    id: Int!
    email: String!
  }

  type Query {
    allUsers: [User]!
    userById(id: Int!): User
    currentUser: CurrentUser
  }

  type Mutation {
    signup(
      firstName: String!
      secondName: String!
      email: String!
      password: String!
    ): String
    login(email: String!, password: String!): Login

    editUser(
      id: Int!
      email: String!
      firstName: String!
      secondName: String!
      password: String
    ): User
  }
`;

module.exports = typeDefs;
