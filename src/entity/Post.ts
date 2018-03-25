import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { Length } from "class-validator";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.posts, { cascadeRemove: true })
  @JoinColumn({ name: "user_id" })
  user: Promise<User>;

  @OneToMany(type => Comment, comment => comment.post)
  comments: Promise<Comment[]|null>;

  @Column("varchar", {length: 200})
  @Length(10, 200)
  title: string;

  @Column("text")
  body: string;
}
