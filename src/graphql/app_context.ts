import { IDatabase } from "pg-promise";
import { PubSubEngine } from "graphql-subscriptions";

export interface Context {
  db: IDatabase<{}>;
  pubsub: PubSubEngine;
}
