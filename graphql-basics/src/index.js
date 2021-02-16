import { GraphQLServer } from 'graphql-yoga';

// Demo data
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
    published: true,
    author: "1"
  },
  {
    id: "2",
    title: "Second Post!",
    body: "How to write posts and influence people",
    published: true,
    author: "1"
  },
  {
    id: "3",
    title: "Feeling cute...might publish later",
    body: "maybs",
    published: false,
    author: "3"
  },
]
const comments = [
  {
    id: "1",
    text: "cool story",
    author: "2",
    post: "3"
  },
  {
    id: "2",
    text: "bad story",
    author: "2",
    post: "2"
  },
  {
    id: "3",
    text: "smart story",
    author: "3",
    post: "3"
  },
  {
    id: "4",
    text: "dumb story",
    author: "1",
    post: "1"
  },
]



// scalar types - String, Int, Boolean, Float, ID (similar to string)
//  ! - required return value.  
// gpa doesn't have a required return value so it can be either a float OR null
const typeDefs = `
  type Query {
    me: User!
    post:Post!
    users(query:String): [User!]!
    posts(query:String):[Post!]!
    comments:[Comment!]!
  }

  type User{
    id: ID!
    name: String!
    email: String!
    age:Int
    posts:[Post!]!
    comments:[Comment!]!
  }

  type Post{
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments:[Comment!]!
  }

  type Comment{
    id:ID!
    text: String!
    author:User!
    post:Post!
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
    },
    comments(parent, args, ctx, info) {
      return comments
    }

  },
  // need to setup a method to resolve every field that  inks to another type
  Post: {
    // called for each Post
    author(parent, args, ctx, info) {
      // information about the Post lives in the parent arg
      return users.find((user) => user.id === parent.author)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      // information about the Post lives in the parent arg
      return posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      // information about the Post lives in the parent arg
      return users.find((user) => user.id === parent.author)
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => post.id === parent.post)
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