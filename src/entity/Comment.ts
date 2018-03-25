import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity()
export class Comment {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.comments, { cascadeRemove: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(type => Post, post => post.comments, { cascadeRemove: true })
  @JoinColumn({ name: "post_id" })
  post: Post;

  @Column("varchar", {length: 200})
  title: string;

  @Column("text")
  body: string;
}
