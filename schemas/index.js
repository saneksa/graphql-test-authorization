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

  type Process {
    id: String
    name: String
    numberOfExecutions: Int
    "Значения в ms"
    averageLeadTime: String
    "Значения в ms"
		averageActiveTime: String
		employeesInvolvedProcess: Int
		numberOfScenarios: Int
		start: String
		end: String
		loading: String
  }

  type Query {
    allUsers: [User]!
    userById(id: Int!): User
    currentUser: User,
    processList:[Process]!
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
