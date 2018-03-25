import { queryResolver, userResolver, postsResolver } from "./resolvers/user";
import { userMutation } from "./mutations/user";
import { postMutation } from "./mutations/post";

export const resolvers = {
  Query: {
    ...queryResolver
  },

  Mutation: {
    ...userMutation,
    ...postMutation
  },

  User: {
    ...userResolver
  },

  Post: {
    ...postsResolver
  }
};
