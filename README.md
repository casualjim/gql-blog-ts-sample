# Example GraphQL blog

A very simple blog engine like application using TypeScript, GraphQL and postgres.

For interaction with postgres this example uses [pg-promise](https://github.com/vitaly-t/pg-promise).  

The example uses [schemats](https://github.com/SweetIQ/schemats) to generate types based on the database tables, 
not an ORM just a typed representation of the tables through interfaces.
This means that you can get typed results from sql queries.

It uses [graphql-import](https://github.com/graphcool/graphql-import) to load a .graphql file instead of inlining it in a string.

The server is apollo with express.

The dev dependencies include ts-node so that you can run typescript directly.

## Running

```
git clone https://github.com/casualjim/gql-blog-ts-sample
cd gql-blog-ts-sample
yarn install
yarn start
```

You can then visit the graphiql UI at http://localhost:3000
