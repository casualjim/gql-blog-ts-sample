import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, RelationCount, JoinTable } from "typeorm";
import { IsEmail } from "class-validator";
import { Post } from "./Post";
import { Comment } from "./Comment";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 100})
  @IsEmail()
  email: string;

  @OneToMany(type => Post, post => post.user)
  posts: Promise<Post[]|null>;

  @OneToMany(type => Comment, comment => comment.user)
  comments: Promise<Comment[]|null>;

  @ManyToMany(type => User, user => user.followee)
  @JoinTable()
  followers: Promise<User[]|null>;

  @RelationCount((user: User) => user.followers)
  followersCount: Promise<number>;

  @ManyToMany(type => User, user => user.followers)
  followee: Promise<User[]|null>;

  @RelationCount((user: User) => user.followee)
  followeeCount: Promise<number>;
}
