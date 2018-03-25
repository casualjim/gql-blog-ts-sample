import { IDatabase } from "pg-promise";
import { users, posts, comments } from "../../gql_blog";
import { Context } from "../app_context";
import { PostUserArgs, FollowerUserArgs } from "gqlblog";
import { Query } from "pg-promise/typescript/pg-subset";
import { CommentPostArgs } from "gqlblog";

export const queryResolver = {
  user(obj: any, { id }: { id: number}, { db }: Context): Promise<users> {
    return db.oneOrNone("SELECT * from users WHERE id = $1", +id);
  }
};

export const userResolver = {
  post(obj: users, {id}: PostUserArgs, {db}: Context): Promise<posts> {
    return db.oneOrNone("SELECT * from posts where id = $1", +id);
  },

  posts(user: users, args: any, {db}: Context): Promise<posts[]> {
    return db.manyOrNone("select * from posts where user_id = $1", user.id);
  },

  follower(user: users, {id}: FollowerUserArgs, {db}: Context): Promise<users> {
    const  subQuery = "select follower_id from followers where follower_id = $1 and followee_id = $2";
    return db.oneOrNone(`SELECT * from users where id in ($subQuery)`, [+id, user.id]);
  },

  followers(user: users, _: any, {db}: Context): Promise<users[]> {
    return db.manyOrNone(
      "SELECT * from users where id in (select follower_id from followers where followee_id = $1)",
      user.id
    );
  },

  followee(user: users, {id}: FollowerUserArgs, {db}: Context): Promise<users> {
    const subQuery = "select followee_id from followers where followee_id = $1 and follower_id = $2";
    return db.oneOrNone(
      `SELECT * from users where id in ($subQuery)`,
      [+id, user.id]
    );
  },

  followees(user: users, _: any, {db}: Context): Promise<users[]> {
    return db.manyOrNone(
      "SELECT * from users where id in (select followee_id from followers where follower_id = $1)",
      user.id
    );
  }
};

export const postsResolver = {
  user(post: posts, args: any, {db}: Context): Promise<users> {
    return db.oneOrNone("select * from users where id = $id", post.user_id);
  },

  comment(post: posts, {id}: CommentPostArgs, {db}: Context): Promise<comments> {
    return db.oneOrNone("select * from comments where id = $1", +id);
  },

  comments(post: posts, _: any, {db}: Context): Promise<comments[]> {
    return db.manyOrNone("select * from comments where post_id = $id", post.id);
  }
};

export const commentsResolver = {
  user(comment: comments, _: any, {db}: Context): Promise<users> {
    return db.oneOrNone("select * from users where id = $1", comment.user_id);
  },

  post(comment: comments, _: any, {db}: Context): Promise<users> {
    return db.oneOrNone("select * from posts where id = $1", comment.post_id);
  }
};

