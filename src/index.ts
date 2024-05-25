import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { addResolversToSchema } from "@graphql-tools/schema";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { bookShelf, bookDb, status, BookCreateInput, BookStatusInput } from "./data.js";

const schema = loadSchemaSync("./schema.graphql", {loaders: [new GraphQLFileLoader()]});
let books = [...bookDb] as BookCreateInput[];

const resolvers = {
  Query: {
    /**
     * 書籍全件取得
     * @returns {BookCreateInput[]} books
     */
    selectBooks: () => books,

    /**
     * IDからの書籍取得
     * @param _ 
     * @param param1 書籍ID
     * @returns 書籍内容
     */
    selectBook: (_, { id }: { id: string }): BookCreateInput => books.find((book) => book.id === id),

    /**
     * 本棚の書籍全件取得
     * @param parent 
     * @returns 
     */
    selectAllBookShelfItem: () => bookShelf,

    /**
     * 本棚にある書籍の詳細取得
     * @param _ 
     * @param param1 {object} 本棚のID
     * @returns {object} 本棚の内容
     */
    selectBookShelfItem: (_, {bookShelfItemId} : {bookShelfItemId: string}) => {
      let res = bookShelf.items.find((item) => item.bookShelfItemId == bookShelfItemId);
      return res;
    }
  },

  Mutation: {
    /**
     * 書籍削除
     * @param _ 
     * @param param1 書籍ID
     * @returns {boolean} ture: 成功, false: 失敗
     */
    deleteBook: (_, { id }: { id: string }): boolean => {
      try {
        books = books.filter((book) => book.id !== id);
        return true;
      } catch (error) {
        return false;
      }
    },

    /**
     * 書籍登録
     * @param _ 
     * @param param1 書籍情報
     * @returns 書籍情報
     */
    createBook: (_, { book } : {book : BookCreateInput}): BookCreateInput | boolean=> {
      try {
        book.id = (books.length + 1).toString();
        books.push(book);
        return book;
      } catch (error) {
        return false;
      }
    },

    /**
     * 書籍更新
     * @param _ 
     * @param param1 書籍情報
     * @returns 書籍情報
     */
    updateBook: (_, { id, book }: {id: string, book: BookCreateInput}): BookCreateInput | boolean => {
      try {
        const index = books.findIndex((book: BookCreateInput) => book.id === id);
        books[index] = { ...books[index], ...book };
        return books[index];
      } catch (error) {
        return false;
      }
    },

    /**
     * 本棚に書籍を追加
     * @param _ 
     * @param param1 書籍ID, ステータス
     * @returns 書籍情報
     */
    addBookShelfItem: (_, {bookId, status}: {bookId: string, status: BookStatusInput}) => {
      try {
        let bookShelfItemId = (bookShelf.items.length + 1).toString();
        bookShelf.items.push({bookShelfItemId, bookId, status: status.readingStatus});
        let res = bookShelf.items.find((item) => item.bookShelfItemId == bookShelfItemId);
        return res;
      } catch (error) {
        return false;
      }
    },

    /**
     * 本棚から書籍を削除
     * @param _ 
     * @param param1 本棚管理のID
     * @returns {boolean} true: 成功, false: 失敗
     */
    deleteBookShelfItem: (_, { bookShelfItemId }: {bookShelfItemId: string}): boolean => {
      try {
        bookShelf.items = bookShelf.items.filter((item) => item.bookShelfItemId !== bookShelfItemId);
        return true;
      } catch (error) {
        return false;
      }
    },


  },

  /**
   * BookShelfItemのリゾルバ
   */
  BookShelfItem: {
    book: (parent) => {
      let id = parent.bookId;
      let res = books.find((book: BookCreateInput) => book.id == id);
      return res;
    },
    status: (parent) => {
      let id = parent.bookShelfItemId;
      let res = status.find((status) => status.bookShelfItemId == id);
      return res;
    }
  },

  /**
   * BookStatusのリゾルバ
   */
  BookStatus: {
    review: (parent) => {
      let id = parent.bookShelfItemId;
      let res = status.find((status) => status.bookShelfItemId == id);
      const result = {score: res.score, comment: res.comment};
      return result;
    }
  },
};

const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
const server = new ApolloServer({ schema: schemaWithResolvers });
const { url } = await startStandaloneServer(server, {listen: { port: 4000 }});
console.log(`🚀  Server ready at: ${url}`);
