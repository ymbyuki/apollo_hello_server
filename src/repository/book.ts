import { BookTbl } from "kysely-codegen";
import { Selectable } from "kysely";
import { db } from "../database/database";

/**
 * 書籍オブジェクトのIDを文字列に変換
 * @param obj 書籍オブジェクト（単体）
 * @returns モディファイ後の書籍オブジェクト
 */
const convart = (obj) => {
  const converted = { ...obj, id: obj.id.toString(), releaseDate: new Date(obj.releaseDate).toString() };
  return converted;
};

/**
 * 全ての書籍取得
 * @returns {object} 書籍一覧
 */
const findAllBooks = async () => {
  try {
    const books: Selectable<BookTbl>[] = await db.selectFrom("bookTbl").selectAll().execute();
    const modifiedBooks = books.map(convart);
    return modifiedBooks;
  } catch (error) {
    return false;
  }
};

/**
 * IDからの書籍取得
 * @param id 書籍ID
 * @returns {object} 書籍内容
 */
const findBookById = async (id: number) => {
  try {
    const book = await db.selectFrom("bookTbl").selectAll().where("id", "=", id).execute();
    const modifiedBooks = convart(book[0]);
    return modifiedBooks;
  } catch {
    return false;
  }
};

const deleteBook = async (id: number) => {
  try {
    const res = await db.deleteFrom("bookTbl").where("id", "=", id).executeTakeFirst();
    if(res.numDeletedRows === 0n) {
      return false;
    } else {
      return true;
    }
  } catch {
    return false;
  }
}

export { findAllBooks, findBookById , deleteBook};
