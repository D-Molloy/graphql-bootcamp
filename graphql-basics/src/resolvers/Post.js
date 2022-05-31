// need to setup a method to resolve every field that links to another type
//   Post is a custom type (check schema.graphql)
const Post = {
    // called for each Post
    author(parent, args, { db }, info) {
      // information about the Post lives in the parent arg
      return db.users.find((user) => user.id === parent.author)
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => comment.post === parent.id)
    }
  }

  export {Post as default}