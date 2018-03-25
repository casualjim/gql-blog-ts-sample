/* tslint:disable */

export interface Query {
  user?: User | null;
}

export interface User {
  id?: string | null;
  email: string;
  post?: Post | null;
  posts: Post[];
  follower?: User | null;
  followers: User[];
  followee?: User | null;
  followees: User[];
}

export interface Post {
  id?: string | null;
  user: User;
  title: string;
  body: string;
  comment?: Comment | null;
  comments: Comment[];
}

export interface Comment {
  id?: string | null;
  user: User;
  post: Post;
  title?: string | null;
  body: string;
}

export interface Mutation {
  createUser?: User | null;
  removeUser?: boolean | null;
  follow?: boolean | null;
  unfollow?: boolean | null;
  createPost?: Post | null;
  removePost?: boolean | null;
  createComment?: Comment | null;
  removeComment?: boolean | null;
}
export interface UserQueryArgs {
  id: string;
}
export interface PostUserArgs {
  id: string;
}
export interface FollowerUserArgs {
  id: string;
}
export interface FolloweeUserArgs {
  id: string;
}
export interface CommentPostArgs {
  id: string;
}
export interface CreateUserMutationArgs {
  email: string;
}
export interface RemoveUserMutationArgs {
  id: string;
}
export interface FollowMutationArgs {
  follower: string;
  followee: string;
}
export interface UnfollowMutationArgs {
  follower: string;
  followee: string;
}
export interface CreatePostMutationArgs {
  user: string;
  title: string;
  body: string;
}
export interface RemovePostMutationArgs {
  id: string;
}
export interface CreateCommentMutationArgs {
  user: string;
  post: string;
  title: string;
  body: string;
}
export interface RemoveCommentMutationArgs {
  id: string;
}
