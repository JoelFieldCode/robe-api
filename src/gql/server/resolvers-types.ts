// tslint:disable max-line-length
// tslint:disable no-namespace
// tslint:disable max-classes-per-file
// tslint:disable trailing-comma
// tslint:disable no-string-literal
// tslint:disable no-shadowed-variable array-type
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql";
import { AppContext } from "../../types/context";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string; };
  String: { input: string; output: string; };
  Boolean: { input: boolean; output: boolean; };
  Int: { input: number; output: number; };
  Float: { input: number; output: number; };
  File: { input: any; output: any; };
}

export interface Category {
  __typename?: "Category";
  id: Scalars["Int"]["output"];
  image_url?: Maybe<Scalars["String"]["output"]>;
  itemCount: Scalars["Int"]["output"];
  items?: Maybe<Array<Item>>;
  name: Scalars["String"]["output"];
}

export class CreateCategoryInput {
  /** @deprecated Item image is now set as category image */
  public image_url?: InputMaybe<Scalars["String"]["input"]>;
  public name: Scalars["String"]["input"];
}

export class CreateItemInput {
  public categoryId: Scalars["Int"]["input"];
  public image_url?: InputMaybe<Scalars["String"]["input"]>;
  public name: Scalars["String"]["input"];
  public price: Scalars["Float"]["input"];
  public url: Scalars["String"]["input"];
}

export interface Item {
  __typename?: "Item";
  categoryId: Scalars["Int"]["output"];
  id: Scalars["Int"]["output"];
  image_url?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  price: Scalars["Float"]["output"];
  url: Scalars["String"]["output"];
}

export interface Mutation {
  __typename?: "Mutation";
  createCategory?: Maybe<Category>;
  createItem?: Maybe<Item>;
  deleteCategory?: Maybe<Scalars["String"]["output"]>;
  deleteItem?: Maybe<Scalars["String"]["output"]>;
  updateCategory?: Maybe<Category>;
  updateItem?: Maybe<Item>;
  uploadImage: Scalars["String"]["output"];
}

export interface MutationCreateCategoryArgs {
  input: CreateCategoryInput;
}

export interface MutationCreateItemArgs {
  input: CreateItemInput;
}

export interface MutationDeleteCategoryArgs {
  categoryId: Scalars["Int"]["input"];
}

export interface MutationDeleteItemArgs {
  itemId: Scalars["Int"]["input"];
}

export interface MutationUpdateCategoryArgs {
  input: UpdateCategoryInput;
}

export interface MutationUpdateItemArgs {
  input: UpdateItemInput;
}

export interface MutationUploadImageArgs {
  image: Scalars["File"]["input"];
}

export interface Query {
  __typename?: "Query";
  getCategories?: Maybe<Array<Category>>;
  getCategory?: Maybe<Category>;
  getItem?: Maybe<Item>;
}

export interface QueryGetCategoryArgs {
  categoryId: Scalars["Int"]["input"];
}

export interface QueryGetItemArgs {
  itemId: Scalars["Int"]["input"];
}

export class UpdateCategoryInput {
  public id: Scalars["Int"]["input"];
  public name: Scalars["String"]["input"];
}

export class UpdateItemInput {
  public categoryId: Scalars["Int"]["input"];
  public id: Scalars["Int"]["input"];
  public image_url?: InputMaybe<Scalars["String"]["input"]>;
  public name: Scalars["String"]["input"];
  public price: Scalars["Float"]["input"];
  public url: Scalars["String"]["input"];
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export interface ResolverWithResolve<TResult, TParent, TContext, TArgs> {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  Category: ResolverTypeWrapper<Category>;
  CreateCategoryInput: CreateCategoryInput;
  CreateItemInput: CreateItemInput;
  File: ResolverTypeWrapper<Scalars["File"]["output"]>;
  Float: ResolverTypeWrapper<Scalars["Float"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  Item: ResolverTypeWrapper<Item>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateItemInput: UpdateItemInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars["Boolean"]["output"];
  Category: Category;
  CreateCategoryInput: CreateCategoryInput;
  CreateItemInput: CreateItemInput;
  File: Scalars["File"]["output"];
  Float: Scalars["Float"]["output"];
  Int: Scalars["Int"]["output"];
  Item: Item;
  Mutation: {};
  Query: {};
  String: Scalars["String"]["output"];
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateItemInput: UpdateItemInput;
}>;

export type CategoryResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes["Category"] = ResolversParentTypes["Category"]> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  image_url?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  itemCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<ResolversTypes["Item"]>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface FileScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["File"], any> {
  name: "File";
}

export type ItemResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes["Item"] = ResolversParentTypes["Item"]> = ResolversObject<{
  categoryId?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  image_url?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  price?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  url?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]> = ResolversObject<{
  createCategory?: Resolver<Maybe<ResolversTypes["Category"]>, ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, "input">>;
  createItem?: Resolver<Maybe<ResolversTypes["Item"]>, ParentType, ContextType, RequireFields<MutationCreateItemArgs, "input">>;
  deleteCategory?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, "categoryId">>;
  deleteItem?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType, RequireFields<MutationDeleteItemArgs, "itemId">>;
  updateCategory?: Resolver<Maybe<ResolversTypes["Category"]>, ParentType, ContextType, RequireFields<MutationUpdateCategoryArgs, "input">>;
  updateItem?: Resolver<Maybe<ResolversTypes["Item"]>, ParentType, ContextType, RequireFields<MutationUpdateItemArgs, "input">>;
  uploadImage?: Resolver<ResolversTypes["String"], ParentType, ContextType, RequireFields<MutationUploadImageArgs, "image">>;
}>;

export type QueryResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]> = ResolversObject<{
  getCategories?: Resolver<Maybe<Array<ResolversTypes["Category"]>>, ParentType, ContextType>;
  getCategory?: Resolver<Maybe<ResolversTypes["Category"]>, ParentType, ContextType, RequireFields<QueryGetCategoryArgs, "categoryId">>;
  getItem?: Resolver<Maybe<ResolversTypes["Item"]>, ParentType, ContextType, RequireFields<QueryGetItemArgs, "itemId">>;
}>;

export type Resolvers<ContextType = AppContext> = ResolversObject<{
  Category?: CategoryResolvers<ContextType>;
  File?: GraphQLScalarType;
  Item?: ItemResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;
