const { buildSchema, GraphQLID } = require("graphql");

module.exports = buildSchema(`

type Family {
  _id: ID!
  name: String!
  creator: User!
  members: [User!]
  pin: String
}

type User {
  _id: ID!
  email: String!
  password: String
  name: String!
  family: Family
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

input CreateUserInput {
  email: String!
  password: String!
  name: String!
  isFamilyCreating: Boolean!
  familyName: String
}

type RootQuery {
  login(email: String!, password: String!): AuthData!
  user(email: String!): User!
}

type RootMutation {
  createUser(userInput: CreateUserInput): User
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`);
