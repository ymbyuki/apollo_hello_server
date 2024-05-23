import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { addResolversToSchema } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
const schema = loadSchemaSync('./schema.graphql', {
    loaders: [new GraphQLFileLoader()],
});
const books = [
    {
        title: "The Awakening",
        author: "Kate Chopin",
        type: "FICTION",
    },
    {
        title: "City of Glass",
        author: "Paul Auster",
        type: "NON_FICTION",
    },
];
const resolvers = {
    Query: {
        books: () => books,
        firstbook: () => books[0],
        bookType: (_, { type }) => books.filter((book) => book.type === type),
    },
};
const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
const server = new ApolloServer({ schema: schemaWithResolvers });
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
