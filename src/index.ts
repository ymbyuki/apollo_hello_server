import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { addResolversToSchema } from "@graphql-tools/schema";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";

interface BookCreateInput {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn?: string | null;
  category: Category;
  releaseDate: string;
}

enum Category {
  FICTION = "FICTION",
  TRAVEL = "TRAVEL",
  HISTORY = "HISTORY",
  SCIENCE = "SCIENCE",
  BUSINESS = "BUSINESS",
  ART = "ART",
  MUSIC = "MUSIC",
}

const schema = loadSchemaSync("./schema.graphql", {
  loaders: [new GraphQLFileLoader()],
});

let books: BookCreateInput[] = [
  {
    id: "1",
    title: "ノンデザイナーズ・デザインブック",
    author: "Robin Williams",
    publisher: "マイナビ出版",
    isbn: "9784839983796",
    category: Category.ART,
    releaseDate: "2023/8/25",
  },
  {
    id: "2",
    title: "頭のいい人だけが解ける論理的思考問題",
    author: "TEST",
    publisher: "ダイヤモンド社",
    isbn: "9784478119044",
    category: Category.BUSINESS,
    releaseDate: "2024/3/27",
  },
];

const resolvers = {
  Query: {
    selectBooks: () => books,
    selectBook: (_, { id }: { id: string }) => books.find((book) => book.id === id),
  },

  Mutation: {
    deleteBook: (_, { id }: { id: string }) => {
      try {
        books = books.filter((book) => book.id !== id);
        return { result: true };
      } catch (error) {
        return { result: false };
      }
    },

    createBook: (_, { book } : {book : BookCreateInput}) => {
      const number = books.length + 1;
      book.id = number.toString();
      console.log(book);
      books.push(book);
      return book;
    },

    updateBook: (_, { id, book }) => {
      const index = books.findIndex((book) => book.id === id);
      books[index] = { ...books[index], ...book };
      return books[index];
    },
  },
};

const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
const server = new ApolloServer({ schema: schemaWithResolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
