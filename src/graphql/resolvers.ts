import { queryResolver, userResolver, postsResolver } from "./resolvers/user";
import { userMutation } from "./mutations/user";
import { postMutation } from "./mutations/post";
import { PubSub, withFilter } from "graphql-subscriptions";
import { IResolvers } from "graphql-tools";

export function resolvers(pubsub: PubSub): IResolvers<any, any> {
  return {
    Query: {
      ...queryResolver
    },

    Mutation: {
      ...userMutation,
      ...postMutation
    },

    Subscription: {
      postAdded: {
        subscribe: () => pubsub.asyncIterator("postAdded")
      },
      postAddedByUser: {
        subscribe: withFilter(() => pubsub.asyncIterator("postAdded"), (payload, variables) => {
          return payload.postAdded.user_id.toString() === variables.user;
        })
      },
      postDeleted: {
        subscribe: () => pubsub.asyncIterator("postDeleted")
      },
      commentAdded: {
        subscribe: () => pubsub.asyncIterator("commentAdded")
      },
      commentAddedToPost: {
        subscribe: withFilter(() => pubsub.asyncIterator("postAdded"), (payload, variables) => {
          return payload.commentAdded.post_id.toString() === variables.post;
        })
      },
      commentDeleted: {
        subscribe: () => pubsub.asyncIterator("commentDeleted")
      }
    },

    User: {
      ...userResolver
    },

    Post: {
      ...postsResolver
    }
  };
}
