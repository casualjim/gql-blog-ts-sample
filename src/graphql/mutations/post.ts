import { posts, comments } from "../../gql_blog";
import { IResult } from "pg-promise/typescript/pg-subset";
import { Context } from "../app_context";
import { CreatePostMutationArgs, RemoveCommentMutationArgs, CreateCommentMutationArgs, RemovePostMutationArgs } from "gqlblog";
import { PubSub } from "graphql-subscriptions";
import { IResolverObject } from "graphql-tools";

export const postMutation = {
  createPost(_: any, { user, title, body }: CreatePostMutationArgs, { db, pubsub }: Context): Promise<posts> {
    const prom = db.one("insert into posts(user_id, title, body) values($1, $2, $3) returning *", [+user, title, body]);
    return prom.then((post) => {
      pubsub.publish("postAdded", { postAdded: post });
      return post;
    });
  },

  removePost(_: any, { id }: RemovePostMutationArgs, { db, pubsub }: Context): Promise<boolean> {
    return db.result("delete from posts where id = $1", +id, (r: IResult) => r.rowCount > 0).then(r => {
      pubsub.publish("postDeleted", { postDeleted: id });
      return r;
    });
  },

  createComment(_: any, { user, post, title, body }: CreateCommentMutationArgs, { db, pubsub }: Context): Promise<boolean> {
    const params = [parseInt(user), parseInt(post), title, body];
    const query = "insert into comments(user_id, post_id, title, body) values($1, $2, $3, $4) returning *";
    return db.one(query, params).then((comment: comments) => {
      pubsub.publish("commentAdded", { commentAdded: comment });
      return true;
    });
  },

  removeComment(_: any, { id }: RemoveCommentMutationArgs, { db, pubsub }: Context): Promise<boolean> {
    const query = "delete from comments where id = $1";
    return db.none(query, +id).then(_ => {
      pubsub.publish("commentDeleted", { commentDeleted: id });
      return true;
    });
  }

};
