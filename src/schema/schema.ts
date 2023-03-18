import { buildSchema } from 'graphql'

// Construct a schema, using GraphQL schema language
export const schema = buildSchema(`
    input CreateCategoryInput {
        name: String!
        image_url: String!
    }
    input CreateItemInput {
        name: String!
        image_url: String!
        url: String!
        price: Float!
        category_id: Int!
    }
  type Category {
    name: String!
    id: Int!
    image_url: String!
  }
  type Item {
    name: String!
    id: Int!
    image_url: String!
    url: String!
    price: Float!
  }
  type Query {
    getCategories: [Category!]
    getCategory(categoryId: Int!): Category
    getCategoryItems(categoryId: Int!): [Item!]
  }
  type Mutation {
    createCategory(input: CreateCategoryInput): Category
    createItem(input: CreateItemInput): Item
  }
`)
