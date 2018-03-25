import { CreateUserMutationArgs, RemoveUserMutationArgs, FollowMutationArgs, UnfollowMutationArgs } from "gqlblog";
import { users } from "../../gql_blog";
import { IResult } from "pg-promise/typescript/pg-subset";
import { Context } from "../app_context";

export const userMutation = {
  createUser(root: any, { email }: CreateUserMutationArgs, { db }: Context, info: any): Promise<users> {
    return db.one("insert into users(email) values($1) returning *", email);
  },

  removeUser(_: any, { id }: RemoveUserMutationArgs, { db }: Context): Promise<boolean> {
    return db.result("delete from users where id = $1", +id, (r: IResult) => r.rowCount > 0);
  },

  follow(_: any, {follower, followee}: FollowMutationArgs, { db }: Context ): Promise<boolean> {
    return db.none("insert into followers(follower_id, followee_id) values($1, $2)", [+follower, +followee]).then(_ => true);
  },

  unfollow(_: any, {follower, followee}: UnfollowMutationArgs, {db}: Context): Promise<boolean> {
    return db.none("delete from followers where follower_id = $1 and followee_id = $2", [+follower, +followee]).then(_ => true);
  }

};
