import { v4 as uuidv4 } from "uuid";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const { name, email, age } = args;
    const emailTaken = db.users.some((user) => user.email === args.data.email);
    if (emailTaken) {
      throw new Error("Email already registered.");
    }
    const user = {
      id: uuidv4(),
      ...args.data,
    };
    db.users.push(user);
    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    // the return array value - splice returns deletedUser - only saving this to return the deleted user at the end of the mutation
    const deletedUsers = db.users.splice(userIndex, 1);
    // remove associated posts and comments
    // if we delete a post, we have to delete comments for the post
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;
      if (match) {
        //if a comment doesn't belong to the current post, it can stay
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }
      // returning true when we didn't find a match so its returned in the new value of db.posts
      return !match;
    });
    //removing all comment created by user on this or other posts
    db.comments = db.comments.filter((comment) => comment.author !== args.id);
    return deletedUsers[0];
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    // find the user to be updated
    const user = db.users.find((user) => user.id === id);
    if (!user) {
      throw new Error("User not found");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);
      if (emailTaken) {
        throw new Error("Email already in use!");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    // Age can be null
    // the type definition will invalidate if the user tries to enter a string before the resolver is run
    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const authorExists = db.users.some((user) => user.id === args.data.author);
    if (!authorExists) {
      throw new Error("Author not found");
    }
    const post = {
      id: uuidv4(),
      ...args.data,
    };
    db.posts.push(post);

    if(args.data.published){
      pubsub.publish(`new-post`, {post})
    }
    return post;
  },
  deletePost(parent, args, { db }, info) {
    //  check if the post exists
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    // remove and return the post
    const [deletedPost] = db.posts.splice(postIndex, 1);
    // remove all comments belonging to that post
    db.comments = db.comments.filter((comment) => comment.post !== args.id);
    return deletedPost;
  },
  updatePost(parent, { id, data }, { db }, info) {
    const foundPost = db.posts.find((post) => post.id === id);
    if (!foundPost) {
      throw new Error("No post with that ID found.");
    }

    if (typeof data.title === "string") {
      foundPost.title = data.title;
    }
    if (typeof data.body === "string") {
      foundPost.body = data.body;
    }
    if (typeof data.published === "boolean") {
      foundPost.published = data.published;
    }

    return foundPost;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const authorExists = db.users.some((user) => user.id === args.data.author);
    const postExists = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );
    if (!authorExists) {
      throw new Error("Author doesn't exist");
    }
    if (!postExists) {
      throw new Error("Post doesn't exist");
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(comment);
    pubsub.publish(`comment-${args.data.post}`, {
      comment:comment
    })
    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    const [removedComments] = db.comments.splice(commentIndex, 1);

    return removedComments;
  },
  updateComment(parent, { id, data }, { db }, info) {
    const foundComment = db.comments.find(comment=> comment.id===id)
    if(!foundComment){
      throw new Error("Comment not found!")
    }

    if(typeof data.text === "string"){
      foundComment.text=data.text;
    }
    return foundComment
  }
};
export { Mutation as default };
