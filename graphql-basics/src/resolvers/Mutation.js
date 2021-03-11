const Mutation = {
  createUser(parent, args, { db }, info) {
    const { name, email, age } = args
    const emailTaken = db.users.some(user => user.email === args.data.email)
    if (emailTaken) {
      throw new Error("Email already registered.")
    }
    const user = {
      id: uuidv4(),
      ...args.data
    }
    db.users.push(user)
    return user
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id)
    if (userIndex === -1) {
      throw new Error("User not found")
    }
    // the return array value
    const deletedUsers = db.users.splice(userIndex, 1)
    // remove associated posts and comments
    // if we delete a post, we have to delete comments for the post
    db.posts = db.posts.filter(post => {
      const match = post.author === args.id
      if (match) {
        //if a comment doesn't belong to the current post, it can stay
        db.comments = db.comments.filter(comment => comment.post !== post.id)
      }
      return !match
    })
    //removing all comment created user created on this or other posts
    db.comments = db.comments.filter(comment => comment.author !== args.id)
    return deletedUsers[0]
  },
  createPost(parent, args, { db }, info) {
    const authorExists = users.some(user => user.id === args.data.author)
    if (!authorExists) {
      throw new Error("Author not found")
    }
    const post = {
      id: uuidv4(),
      ...args.data
    }
    db.posts.push(post)
    return post
  },
  deletePost(parent, args, { db }, info) {
    //  check if the post exists
    const postIndex = db.posts.findIndex(post => post.id === args.id)
    if (postIndex === -1) {
      throw new Error("Post not found")
    }
    // remove and return the post
    const [deletedPost] = db.posts.splice(postIndex, 1)
    // remove all comments belonging to that post
    db.comments = db.comments.filter(comment => comment.post !== args.id)
    return deletedPost
  },
  createComment(parent, args, { db }, info) {
    const authorExists = db.users.some(user => user.id === args.data.author)
    const postExists = db.posts.some(post => post.id === args.data.post && post.published)
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

    db.comments.push(comment)

    return comment

  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

    if (commentIndex === -1) {
      throw new Error("Comment not found")
    }
    const [removedComments] = db.comments.splice(commentIndex, 1)

    return removedComments
  }
}