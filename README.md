# GraphQL Bootcamp

# Three Main Operations
- Query - Read data
- Mutations - Create, Update, Delete

## Parts of a Graph
- Types (User/Post/Comment)
- types have fields (id/name/age)
- relationships :
    - User has many posts, a post has one user(author)
    - Comment has one Post and Post has many comments
    - Comment has a User (author) and a user has many comments

## demo graphiql playground
https://graphql-demo.mead.io/

Schema in graphiql - shows queries and return types
`course:String!` - ! - type of value will always be returned (not null)
- leaving off means the field is non nullable

### Query - fetching data
```
query{
  users{
    id
    name
    posts{
      title
      body
    }
  }
}
```
```
{
  "data": {
    "users": [
      {
        "id": "329e531d-2402-46eb-8de6-e01ed2db1958",
        "name": "Andrew",
        "posts": [
          {
            "title": "GraphQL 101",
            "body": "This is how to use GraphQL..."
          },
          {
            "title": "GraphQL 201",
            "body": "This is an advanced GraphQL post..."
          }
        ]
      },
      {
        "id": "01ac7dbd-ee0e-41a5-ad17-907c327c3a08",
        "name": "Sarah",
        "posts": [
          {
            "title": "Programming Music",
            "body": "David Cutter Music is my favorite artist to listen to while programming."
          }
        ]
      },
      {
        "id": "b377d0e3-e09a-4d14-8d07-48750e3da511",
        "name": "Michael",
        "posts": []
      }
    ]
  }
}
```


##  Type definitions === application schema
##  Resolvers -  a set of functions that return different parts of data available in schema

## 5 Main Scalar (Primitive) types
A GraphQL object type has a name and fields, but at some point those fields have to resolve to some concrete data. That's where the scalar types come in: they represent the leaves of the query.
- String
- Boolean
- Int
- Float
- ID

## Custom Types
Define the shape of data by including it in the typeDefs
- If returning a non-scalar value (like a custom type), you must specify a selection set to get down to scalar values

## Operation Arguments
- Passing data from client to server (creating or filtering data)
### 4 arguments passed to all resolvers
- parent - hierarchical structure of query 
- args -get the args passed from the client
- ctx - contextual info e.g. is the user logged in
- info - 

client
```
query{}
  greeting(name: "Denis")
}
```
server
```
const typeDefs = `
  type Query {
    greeting(name: String): String!
  } 
`

const resolvers = {
  Query: {
    greeting(parent, args) {
      return `Hello${args.name ? " " + args.name : ""}!`
    },
  }
}

```

### Mutations
- because the return type is User, have to return a selection set (scalar fields)
```
mutation{
  createUser(name:"Denis", email:"denis@test.com"){
    id
    name
    email
  }
}
```

- refactor arguments with `input` types
```
  type Mutation {
    createUser(data: CreateUserInput!):User!
  }

  input CreateUserInput {
    name:String! 
    email:String! 
    age:Int
  }
  ----------------
  mutation{
  createUser(data:{
    name:"Foo", 
    email:"Foo@test.com",
    age:30
  }){
    id
    name
    email
  }
}
```
- input types must return scalars
- in the mutations, args must be reference the data object - args.data.name, etc