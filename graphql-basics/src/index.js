import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
// Demo data
let users = [
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
let posts = [
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
let comments = [
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

  type Mutation {
    createUser(data: CreateUserInput!):User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput!):Post!
    deletePost(id: ID!): Post!
    createComment(data:CreateCommentInput!):Comment!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name:String! 
    email:String! 
    age:Int
  }
  input CreatePostInput {
    title:String! 
    body:String! 
    published: Boolean! 
    author:ID!
  }
  input CreateCommentInput {
    text:String! 
    author:ID! 
    post: ID!
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const { name, email, age } = args
      const emailTaken = users.some(user => user.email === args.data.email)
      if (emailTaken) {
        throw new Error("Email already registered.")
      }
      const user = {
        id: uuidv4(),
        ...args.data
      }
      users.push(user)
      return user
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id)
      if (userIndex === -1) {
        throw new Error("User not found")
      }
      // the return array value
      const deletedUsers = users.splice(userIndex, 1)
      // remove associated posts and comments
      // if we delete a post, we have to delete comments for the post
      posts = posts.filter(post => {
        const match = post.author === args.id
        if (match) {
          //if a comment doesn't belong to the current post, it can stay
          comments = comments.filter(comment => comment.post !== post.id)
        }
        return !match
      })
      //removing all comment created user created on this or other posts
      comments = comments.filter(comment => comment.author !== args.id)
      return deletedUsers[0]
    },
    createPost(parent, args, ctx, info) {
      const authorExists = users.some(user => user.id === args.data.author)
      if (!authorExists) {
        throw new Error("Author not found")
      }
      const post = {
        id: uuidv4(),
        ...args.data
      }
      posts.push(post)
      return post
    },
    deletePost(parent, args, ctx, info) {
      //  check if the post exists
      const postIndex = posts.findIndex(post => post.id === args.id)
      if (postIndex === -1) {
        throw new Error("Post not found")
      }
      // remove and return the post
      const [deletedPost] = posts.splice(postIndex, 1)
      // remove all comments belonging to that post
      comments = comments.filter(comment => comment.post !== args.id)
      return deletedPost
    },
    createComment(parent, args, ctx, info) {
      const authorExists = users.some(user => user.id === args.data.author)
      const postExists = posts.some(post => post.id === args.data.post && post.published)
      if (!authorExists) {
        throw new Error("Author doesn't exist")
      }
      if (!postExists) {
        throw new Error("Post doesn't exist")
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      }

      comments.push(comment)

      return comment

    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex((comment) => comment.id === args.id)

      if (commentIndex === -1) {
        throw new Error("Comment not found")
      }
      const [removedComments] = comments.splice(commentIndex, 1)

      return removedComments
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
      // information about the User lives in the parent arg
      return posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      // information about the Comment lives in the parent arg
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