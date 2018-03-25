import { IDatabase } from "pg-promise";

export interface Context {
  db: IDatabase<{}>;
}
