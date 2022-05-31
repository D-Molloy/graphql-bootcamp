import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from "./db"
import Query from "./resolvers/Query"
import Mutation from "./resolvers/Mutation"
import Subscription from "./resolvers/Subscription"
import User from "./resolvers/User"
import Post from "./resolvers/Post"
import Comment from "./resolvers/Comment"

// PubSub is used by Subscriptions and needs to be added to context so it can be used in resovlers
const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  // resolvers -  a set of functions that return different parts of data available in schema
  resolvers:{
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  // setting up the ctx param in resolvers
  context: {
    db, 
    pubsub
  }
})

// defaults to localhost:4000
server.start(() => {
  console.log(`Listening on http://localhost:4000`)
})