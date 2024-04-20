// tslint:disable max-line-length
// tslint:disable no-namespace
// tslint:disable max-classes-per-file
// tslint:disable trailing-comma
// tslint:disable no-string-literal
// tslint:disable no-shadowed-variable array-type
import { GraphQLResolveInfo } from "graphql";
import { AppContext } from "../../types/context";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
}

export interface AuthResponse {
  __typename?: "AuthResponse";
  token: Scalars["String"];
}

export interface Category {
  __typename?: "Category";
  id: Scalars["Int"];
  image_url?: Maybe<Scalars["String"]>;
  itemCount: Scalars["Int"];
  items?: Maybe<Array<Item>>;
  name: Scalars["String"];
}

export interface CreateCategoryInput {
  image_url?: InputMaybe<Scalars["String"]>;
  name: Scalars["String"];
}

export interface CreateItemInput {
  categoryId: Scalars["Int"];
  image_url?: InputMaybe<Scalars["String"]>;
  name: Scalars["String"];
  price: Scalars["Float"];
  url: Scalars["String"];
}

export interface Item {
  __typename?: "Item";
  categoryId: Scalars["Int"];
  id: Scalars["Int"];
  image_url?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  price: Scalars["Float"];
  url: Scalars["String"];
}

export interface Mutation {
  __typename?: "Mutation";
  createCategory?: Maybe<Category>;
  createItem?: Maybe<Item>;
  deleteCategory?: Maybe<Scalars["String"]>;
  deleteItem?: Maybe<Scalars["String"]>;
  login: AuthResponse;
}

export interface MutationCreateCategoryArgs {
  input?: InputMaybe<CreateCategoryInput>;
}

export interface MutationCreateItemArgs {
  input?: InputMaybe<CreateItemInput>;
}

export interface MutationDeleteCategoryArgs {
  categoryId: Scalars["Int"];
}

export interface MutationDeleteItemArgs {
  itemId: Scalars["Int"];
}

export interface Query {
  __typename?: "Query";
  getCategories?: Maybe<Array<Category>>;
  getCategory?: Maybe<Category>;
}

export interface QueryGetCategoryArgs {
  categoryId: Scalars["Int"];
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
  AuthResponse: ResolverTypeWrapper<AuthResponse>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Category: ResolverTypeWrapper<Category>;
  CreateCategoryInput: CreateCategoryInput;
  CreateItemInput: CreateItemInput;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  Item: ResolverTypeWrapper<Item>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars["String"]>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthResponse: AuthResponse;
  Boolean: Scalars["Boolean"];
  Category: Category;
  CreateCategoryInput: CreateCategoryInput;
  CreateItemInput: CreateItemInput;
  Float: Scalars["Float"];
  Int: Scalars["Int"];
  Item: Item;
  Mutation: {};
  Query: {};
  String: Scalars["String"];
}>;

export type AuthResponseResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes["AuthResponse"] = ResolversParentTypes["AuthResponse"]> = ResolversObject<{
  token?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CategoryResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes["Category"] = ResolversParentTypes["Category"]> = ResolversObject<{
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  image_url?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  itemCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<ResolversTypes["Item"]>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

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
  createCategory?: Resolver<Maybe<ResolversTypes["Category"]>, ParentType, ContextType, Partial<MutationCreateCategoryArgs>>;
  createItem?: Resolver<Maybe<ResolversTypes["Item"]>, ParentType, ContextType, Partial<MutationCreateItemArgs>>;
  deleteCategory?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, "categoryId">>;
  deleteItem?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType, RequireFields<MutationDeleteItemArgs, "itemId">>;
  login?: Resolver<ResolversTypes["AuthResponse"], ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]> = ResolversObject<{
  getCategories?: Resolver<Maybe<Array<ResolversTypes["Category"]>>, ParentType, ContextType>;
  getCategory?: Resolver<Maybe<ResolversTypes["Category"]>, ParentType, ContextType, RequireFields<QueryGetCategoryArgs, "categoryId">>;
}>;

export type Resolvers<ContextType = AppContext> = ResolversObject<{
  AuthResponse?: AuthResponseResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  Item?: ItemResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;
