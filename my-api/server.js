const { ApolloServer, gql } = require('apollo-server');

const schema = gql(`
  type Query {
    currentUser: User
    currentUser2: User
    currentUser3: User
    postsByUser(userId: String!): [Post]
    postsByUser2(userId: String!): [Post]
    postsByUser3(userId: String!): [Post]
  }

  type Mutation {
    addPost(content: String): Post 
  }

  type User {
    id: ID!
    username: String!
    posts: [Post]
  }

  type Post {
    id: ID!
    content: String!
    userId: ID!
  }
`);

var data = {};

data.posts = [
  { 
    id: 'xyz-1',
    content: "First Post - Hello world",
    userId: 'abc-1',
  },
  {
    id: 'xyz-2',
    content: "Second Post - Hello again",
    userId: 'abc-2',
  },
  {
    id: 'xyz-3',
    content: "Third Post - Hello again",
    userId: 'abc-3',
  }
];

data.users = [
  {
    id: 'abc-1', 
    username: "Nydia Wesdi",
  },
  {
    id: 'abc-2', 
    username: "Azman Musa",
  },
  {
    id: 'abc-3', 
    username: "Barizah Khasfullah",
  }
];

const currentUserId = 'abc-1';
const currentUserId2 = 'abc-2';
const currentUserId3 = 'abc-3';

var resolvers = {
  Mutation: {
    addPost: async (_, { content }, { currentUserId, data }) => {
      let post = { 
        id: 'xyz-' + (data.posts.length + 1), 
        content: content, 
        userId: currentUserId,
      };
      data.posts.push(post);
      return post;
    }
  },
  Query: {
    currentUser: (parent, args, context) => {
      let user = context.data.users.find( u => u.id === context.currentUserId );
      return user;
    },
    currentUser2: (parent, args, context) => {
      let user = context.data.users.find( u => u.id === context.currentUserId2 );
      return user;
    },
    currentUser3: (parent, args, context) => {
      let user = context.data.users.find( u => u.id === context.currentUserId3 );
      return user;
    },
    postsByUser: (parent, args, context) => {
      let posts = context.data.posts.filter( p => p.userId === args.userId ); 
      return posts
    },
    postsByUser2: (parent, args, context) => {
      let secondposts = context.data.posts.filter( p => p.userId === args.userId ); 
      return secondposts
    },
    postsByUser3: (parent, args, context) => {
      let thirdposts = context.data.posts.filter( p => p.userId === args.userId ); 
      return thirdposts
    },
  },
  User: {
    posts: (parent, args, context) => {
      let posts = context.data.posts.filter( p => p.userId === parent.id );
      return posts;
    }
  }
};

const server = new ApolloServer({ 
  typeDefs: schema, 
  resolvers: resolvers,
  context: { 
    currentUserId,
    currentUserId2,
    currentUserId3,
    data
  }
});

server.listen(4001).then(({ url }) => {
  console.log('API server running at localhost:4001');
});
