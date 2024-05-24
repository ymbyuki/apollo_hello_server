import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { addResolversToSchema } from "@graphql-tools/schema";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
var Category;
(function (Category) {
    Category["FICTION"] = "FICTION";
    Category["TRAVEL"] = "TRAVEL";
    Category["HISTORY"] = "HISTORY";
    Category["SCIENCE"] = "SCIENCE";
    Category["BUSINESS"] = "BUSINESS";
    Category["ART"] = "ART";
    Category["MUSIC"] = "MUSIC";
})(Category || (Category = {}));
var Status;
(function (Status) {
    Status["READING"] = "READING";
    Status["READ"] = "READ";
    Status["UNREAD"] = "UNREAD";
})(Status || (Status = {}));
const schema = loadSchemaSync("./schema.graphql", {
    loaders: [new GraphQLFileLoader()],
});
let bookShelf = { items: [{
            bookShelfItemId: 1,
            bookId: 1,
            status: 1
        },
        {
            bookShelfItemId: 2,
            bookId: 2,
            status: 2
        }] };
let status = [{
        bookShelfItemId: 1,
        readingStatus: Status.READING,
        comment: "TESTTEST",
        score: 5
    },
    {
        bookShelfItemId: 2,
        readingStatus: Status.READ,
        comment: "TESTTEST",
        score: 3
    }];
let books = [
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
        selectBook: (_, { id }) => books.find((book) => book.id === id),
        selectAllBookShelfItem: (parent) => {
            return bookShelf;
        },
        selectBookShelfItem: (_, { bookShelfItemId }) => {
            let res = bookShelf.items.find((item) => item.bookShelfItemId == bookShelfItemId);
            console.log(res);
            return res;
        }
    },
    BookShelfItem: {
        book: (parent, args, context, info) => {
            let id = parent.bookId;
            let res = books.find((book) => book.id == id);
            return res;
        },
        status: (parent, args, context, info) => {
            let id = parent.bookShelfItemId;
            let res = status.find((status) => status.bookShelfItemId == id);
            return res;
        }
    },
    BookStatus: {
        review: (parent, args, context, info) => {
            let id = parent.bookShelfItemId;
            let res = status.find((status) => status.bookShelfItemId == id);
            const result = { score: res.score, comment: res.comment };
            return result;
        }
    },
    Mutation: {
        deleteBook: (_, { id }) => {
            try {
                books = books.filter((book) => book.id !== id);
                return { result: true };
            }
            catch (error) {
                return { result: false };
            }
        },
        createBook: (_, { book }) => {
            const number = books.length + 1;
            book.id = number.toString();
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
