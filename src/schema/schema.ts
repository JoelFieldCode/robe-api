import { buildSchema } from 'graphql'

// Construct a schema, using GraphQL schema language
export const schema = buildSchema(`
  type Category {
    name: String!
    id: Int!
    image_url: String!
  }
  type Query {
    categories: [Category]
  }
`);
