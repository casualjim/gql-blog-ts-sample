import express from "express";
import * as bodyParser from "body-parser";
import { GraphQLSchema } from "graphql";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./graphql/resolvers";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { IMain, IDatabase, IOptions } from "pg-promise";
import pgPromise from "pg-promise";


// Database connection parameters:
const config = {
  host: "localhost",
  port: 5432,
  database: "gql_blog",
  user: "postgres"
};

const typeDefs = importSchema("src/schema.graphql");
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
const app = express();
app.use(bodyParser.json());

const pgp = pgPromise();
const db = pgp(config);
const context = {
  db: db
};

// GraphQL
app.use("/graphql", graphqlExpress({ schema, context }));
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql"}));

app.listen(3000);
console.log("listening on http://localhost:3000");
