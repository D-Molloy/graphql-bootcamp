import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import db from "./db"
// resolvers -  a set of functions that return different parts of data available in schema
const resolvers = {
  Mutation: ,
  // need to setup a method to resolve every field that  inks to another type
  Post: {
    // called for each Post
    author(parent, args, { db }, info) {
      // information about the Post lives in the parent arg
      return db.users.find((user) => user.id === parent.author)
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, { db }, info) {
      // information about the User lives in the parent arg
      return db.posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, { db }, info) {
      // information about the Comment lives in the parent arg
      return db.users.find((user) => user.id === parent.author)
    },
    post(parent, args, { db }, info) {
      return db.posts.find((post) => post.id === parent.post)
    }
  }
}

const server = new GraphQLServer({
  // must pass in these two:
  typeDefs: "./src/schema.graphql",
  resolvers,
  // setting up the ctx param in resolvers
  context: {
    db: db
  }
})

// defaults to localhost:4000
server.start(() => {
  console.log(`Listening on http://localhost:4000`)
})