const Query = {
  users(parent, { query }, { db }, info) {
    if (!query) {
      return db.users
    }

    return db.users.filter(user => user.name.toLowerCase().includes(query))

  },
  posts(parent, { query }, { db }, info) {
    if (!query) {
      return db.posts
    }

    return db.posts.filter(post => {
      const isTitleMatch = post.title.toLowerCase().includes(query.toLowerCase())
      const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase())
      return isTitleMatch || isBodyMatch
    })
  },
  comments(parent, args, { db }, info) {
    return db.comments
  }
}

export { Query as default }