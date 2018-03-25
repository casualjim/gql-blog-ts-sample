import { Request, Response } from "express";
import { getManager, Repository, DeepPartial } from "typeorm";
import { Post } from "../entity/Post";
import { validate, ValidationError } from "class-validator";
import {  Express } from "express";

export function register(app: Express) {
  app.get("/posts", getAllPosts);
  app.post("/posts", createPost);
  app.put("/posts/:id", updatePost);
  app.delete("/posts/:id", deletePost);
}

async function getAllPosts(request: Request, response: Response) {
  const postRepo = getManager().getRepository(Post);
  const posts = await postRepo.find();
  response.send(posts);
}

async function createPost(request: Request, response: Response) {
  const postRepo = getManager().getRepository(Post);
  const post = postRepo.create( request.body as DeepPartial<Post>);

  await validateAndSave(postRepo, post, response);
}

async function updatePost(request: Request, response: Response) {
  const postRepo = getManager().getRepository(Post);
  const post = await postRepo.findOneById(request.params.id);
  postRepo.merge(post, request.body);

  await validateAndSave(postRepo, post, response);
}

async function deletePost(request: Request, response: Response) {
  return await getManager().getRepository(Post).deleteById(request.params.id);
}

async function validateAndSave(repo: Repository<Post>, post: Post, response: Response) {
  const errors = await validate(post);
  if (errors.length > 0) {
    response.status(422);
    response.send({errors: buildErrorList(errors)});
  } else {
    await repo.save(post);
    response.send(post);
  }
}

export class InputError {
  constructor ( public property: string, public message: string) {}
}
function buildErrorList(err: ValidationError[]): InputError[]|null {
  return err.reduce((acc, ele) => {
    const errs = Object.keys(ele.constraints).map(k => new InputError(ele.property, ele.constraints[k]));
    errs.forEach(err => acc.push(err));
    return acc;
  }, []);
}
