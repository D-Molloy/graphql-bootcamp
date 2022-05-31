// need to setup a method to resolve every field that links to another type
//   User is a custom type (check schema.graphql)
const User = {
  posts(parent, args, { db }, info) {
    // information about the User lives in the parent arg
    return db.posts.filter((post) => post.author === parent.id);
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter((comment) => comment.author === parent.id);
  },
};

export { User as default };
