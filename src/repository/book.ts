import { DB, BookTbl } from "kysely-codegen";
import {Selectable} from "kysely";
import { db } from "../database/database";
import { release } from "os";

const convart = (obj) => {
  const converted = {...obj, id: obj.id.toString(), releaseDate: new Date(obj.releaseDate).toString()}
  return converted;
}

const findAllBooks = async () => {
  const books: Selectable<BookTbl>[] = await db.selectFrom("bookTbl").selectAll().execute();
  const modifiedBooks = books.map(convart);
  return modifiedBooks;
}

const findBookById = async (id: number) => {
  const book = await db.selectFrom("bookTbl").selectAll().where('id', '=', id).execute()
  return book;
}
export { findAllBooks, findBookById}