import { DB, BookTbl, AuthorTbl } from "kysely-codegen";
import {Selectable} from "kysely";
import { db } from "../database/database";

const findAuthorById = async (id: number) => {
  const author = await db.selectFrom("authorTbl").select('name as author').where('id', '=', id).execute();
  console.log(author);
  return author[0];
}

findAuthorById(1);

export { findAuthorById }