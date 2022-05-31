import { GraphQLServer } from 'graphql-yoga';
import db from "./db"
import Query from "./resolvers/Query"
import Mutation from "./resolvers/Mutation"
import User from "./resolvers/User"
import Post from "./resolvers/Post"
import Comment from "./resolvers/Comment"

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  // resolvers -  a set of functions that return different parts of data available in schema
  resolvers:{
    Query,
    Mutation,
    User,
    Post,
    Comment
  },
  // setting up the ctx param in resolvers
  context: {
    db: db
  }
})

// defaults to localhost:4000
server.start(() => {
  console.log(`Listening on http://localhost:4000`)
})