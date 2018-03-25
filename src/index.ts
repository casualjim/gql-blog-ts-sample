import express from "express";
import * as bodyParser from "body-parser";
import { GraphQLSchema } from "graphql";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";
import { resolvers as rootResolvers } from "./graphql/resolvers";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { IMain, IDatabase, IOptions } from "pg-promise";
import pgPromise from "pg-promise";
import morgan from "morgan";

const PORT = 3000;
// Database connection parameters:
const config = {
  host: "localhost",
  port: 5432,
  database: "gql_blog",
  user: "postgres"
};

const pubsub = new PubSub();
const typeDefs = importSchema("src/schema.graphql");
const resolvers = rootResolvers(pubsub);
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));

const pgp = pgPromise();
const db = pgp(config);
const context = {
  db: db,
  pubsub: pubsub,
};
pubsub.subscribe("postAdded", (payload) => console.log("post added triggered: %o", payload));

// GraphQL
app.use("/graphql", graphqlExpress({ schema, context }));
app.use("/graphiql", graphiqlExpress({
  endpointURL: "/graphql",
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
}));

const server = createServer(app);

server.listen(PORT, () => {
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: server,
    path: "/subscriptions",
  });
});
console.log("listening on http://localhost:3000");
