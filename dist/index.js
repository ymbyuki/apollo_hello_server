import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { addResolversToSchema } from "@graphql-tools/schema";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { bookShelf, bookDb, status } from "./data.js";
const schema = loadSchemaSync("./schema.graphql", { loaders: [new GraphQLFileLoader()] });
let books = [...bookDb];
const resolvers = {
    Query: {
        selectBooks: () => books,
        selectBook: (_, { id }) => books.find((book) => book.id === id),
        selectAllBookShelfItem: () => bookShelf,
        selectBookShelfItem: (_, { bookShelfItemId }) => {
            let res = bookShelf.items.find((item) => item.bookShelfItemId == bookShelfItemId);
            return res;
        }
    },
    Mutation: {
        deleteBook: (_, { id }) => {
            try {
                books = books.filter((book) => book.id !== id);
                return true;
            }
            catch (error) {
                return false;
            }
        },
        createBook: (_, { book }) => {
            book.id = (books.length + 1).toString();
            books.push(book);
            return book;
        },
        updateBook: (_, { id, book }) => {
            const index = books.findIndex((book) => book.id === id);
            books[index] = { ...books[index], ...book };
            return books[index];
        },
        deleteBookShelfItem: (_, { bookShelfItemId }) => {
            try {
                bookShelf.items = bookShelf.items.filter((item) => item.bookShelfItemId !== bookShelfItemId);
                return true;
            }
            catch (error) {
                return false;
            }
        }
    },
    BookShelfItem: {
        book: (parent) => {
            let id = parent.bookId;
            let res = books.find((book) => book.id == id);
            return res;
        },
        status: (parent) => {
            let id = parent.bookShelfItemId;
            let res = status.find((status) => status.bookShelfItemId == id);
            return res;
        }
    },
    BookStatus: {
        review: (parent) => {
            let id = parent.bookShelfItemId;
            let res = status.find((status) => status.bookShelfItemId == id);
            const result = { score: res.score, comment: res.comment };
            return result;
        }
    },
};
const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
const server = new ApolloServer({ schema: schemaWithResolvers });
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`🚀  Server ready at: ${url}`);
