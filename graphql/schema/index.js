const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Task {
  _id: ID!
  title: String!
  points: Int!
  deadline: String!
  executor: User
  family: Family!
  finished: Boolean!
  createdAt: String
  updatedAt: String
  toAccept: Boolean!
  accepted: [User]
}

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
  family: Family
}

input CreateUserInput {
  email: String!
  password: String!
  name: String!
  isFamilyCreating: Boolean!
  familyName: String
}
input CreateTaskInput {
  title: String!
  points: Int!
  deadline: String!
  familyID: String!
}
type RootQuery {
  login(email: String!, password: String!): AuthData!
  user(email: String!): User
  getUserById(id: String!): User
  getFamilyTasks(familyID: String!): [Task!]
}

type RootMutation {
  createUser(userInput: CreateUserInput): User
  joinToFamily(userID: String!, pin: String!): Family!
  createTask(taskInput: CreateTaskInput): Task!
  bookTask(taskID: String!, executorID: String!): Task!
  deleteTask(taskID: String!): Boolean
  finishedTask(taskID: String!): Task
  acceptTask(taskID: String!, familyID: String!, userID: String!): Task
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`);
