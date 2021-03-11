// Demo data
const users = [
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
const posts = [
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
const comments = [
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

const db = {
  users,
  posts,
  comments
}

export { db as default }