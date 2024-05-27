import { DB, BookTbl } from "kysely-codegen";
import {Selectable} from "kysely";
import { db } from "./database";
async function hoge() {
  const books: Selectable<BookTbl>[] = await db.selectFrom("bookTbl").selectAll().execute();
  console.log(books);
}
hoge();