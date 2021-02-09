import { GraphQLServer } from 'graphql-yoga';

// scalar types - String, Int, Boolean, Float, ID (similar to string)
//  ! - required return value.  
// gpa doesn't have a required return value so it can be either a float OR null
const typeDefs = `
  type Query {
    me: User!
  }

  type User{
    id: ID!
    name: String!
    email: String!
    age:Int
  }
`

// resolvers -  a set of functions that return different parts of data available in schema
const resolvers = {
  Query: {
    me() {
      return {
        id: "123456",
        name: "Denis",
        email: "denis@test.com"
      }
    }
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