import { posts } from "../../gql_blog";
import { IResult } from "pg-promise/typescript/pg-subset";
import { Context } from "../app_context";
import { CreatePostMutationArgs, RemoveCommentMutationArgs, CreateCommentMutationArgs, RemovePostMutationArgs } from "gqlblog";

export const postMutation = {
  createPost(_: any, { user, title, body }: CreatePostMutationArgs, { db }: Context): Promise<posts> {
    return db.one("insert into posts(user_id, title, body) values($1, $2, $3)", [parseInt(user), title, body]);
  },

  removePost(_: any, { id }: RemovePostMutationArgs, { db }: Context): Promise<boolean> {
    return db.result("delete from users where id = $1", +id, (r: IResult) => r.rowCount > 0);
  },

  createComment(_: any, {user, post, title, body}: CreateCommentMutationArgs, { db }: Context ): Promise<boolean> {
    const params = [parseInt(user), parseInt(post), title, body];
    const query = "insert into comments(user_id, post_id, title, body) values($1, $2, $3, $4)";
    return db.none(query, params).then(_ => true);
  },

  removeComment(_: any, {id}: RemoveCommentMutationArgs, {db}: Context): Promise<boolean> {
    const query = "delete from comments where id = $1";
    return db.none(query, +id).then(_ => true);
  }

};
