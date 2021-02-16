import { GraphQLServer } from 'graphql-yoga';

// scalar types - String, Int, Boolean, Float, ID (similar to string)
//  ! - required return value.  
// gpa doesn't have a required return value so it can be either a float OR null
const typeDefs = `
  type Query {
    me: User!
    post:Post!
    users(query:String): [User!]!
    posts(query:String):[Post!]!
  }

  type User{
    id: ID!
    name: String!
    email: String!
    age:Int
  }

  type Post{
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`

// Demo user data
const users = [
  {
    id: "1",
    name: "Denis",
    email: "denis@test.com"
  },
  {
    id: "2",
    name: "Amanda",
    email: "amanda@test.com",
    age: 21
  },
  {
    id: "3",
    name: "Johnny T",
    email: "johnT@test.com",
    age: 0
  },
]
const posts = [
  {
    id: "1",
    title: "My first post",
    body: "Hello world I can write internetz",
    published: true
  },
  {
    id: "2",
    title: "Second Post!",
    body: "How to write posts and influence people",
    published: true
  },
  {
    id: "3",
    title: "Feeling cute...might publish later",
    body: "maybs",
    published: false
  },
]


// resolvers -  a set of functions that return different parts of data available in schema
const resolvers = {
  Query: {

    me() {
      return {
        id: "123456",
        name: "Denis",
        email: "denis@test.com"
      }
    },
    post() {
      return {
        id: "543",
        title: "Sunday Scaries",
        body: "Dont be afraid of the week ahead",
        published: false
      }
    },
    users(parent, { query }, ctx, info) {
      if (!query) {
        return users
      }

      return users.filter(user => user.name.toLowerCase().includes(query))

    },
    posts(parent, { query }, ctx, info) {
      if (!query) {
        return posts
      }

      return posts.filter(post => {
        const isTitleMatch = post.title.toLowerCase().includes(query.toLowerCase())
        const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase())
        return isTitleMatch || isBodyMatch
      })

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