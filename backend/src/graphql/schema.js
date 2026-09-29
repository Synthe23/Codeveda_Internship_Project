export const typeDefs = `#graphql
  enum TaskStatus {
    todo
    in_progress
    done
  }

  enum TaskPriority {
    low
    medium
    high
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    dueDate: String
    owner: User!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    me: User
    tasks(status: TaskStatus, priority: TaskPriority): [Task!]!
  }

  type Mutation {
    createTask(
      title: String!
      description: String
      status: TaskStatus
      priority: TaskPriority
      dueDate: String
    ): Task!
    updateTask(
      id: ID!
      title: String
      description: String
      status: TaskStatus
      priority: TaskPriority
      dueDate: String
    ): Task!
    deleteTask(id: ID!): Boolean!
  }
`;
