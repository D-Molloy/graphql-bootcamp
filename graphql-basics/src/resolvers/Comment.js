// need to setup a method to resolve every field that links to another type
//   Comment is a custom type (check schema.graphql)
const Comment = {
  author(parent, args, { db }, info) {
    // information about the Comment lives in the parent arg
    return db.users.find((user) => user.id === parent.author);
  },
  post(parent, args, { db }, info) {
    return db.posts.find((post) => post.id === parent.post);
  },
};

export { Comment as default };
