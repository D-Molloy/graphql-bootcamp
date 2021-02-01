import { GraphQLServer } from 'graphql-yoga';

// type definitions - application schema
const typeDefs = `
  type Query {
    id:ID!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float
  }
`

// resolvers -  a set of functions that return different parts of data available in schema
const resolvers = {
  Query: {
    id() {
      return "abc123"
    },
    name() {
      return "denis"
    },
    age() {
      return 41
    },
    employed() {
      return true
    },
    gpa() {
      return null
    },
  }
}

const server = new GraphQLServer({
  // must pass in these two:
  typeDefs,
  resolvers
})

// defaults to localhost:4000
server.start(() => {
  console.log(`Listening on http://localhost:4000`)
})