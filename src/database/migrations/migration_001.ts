import { Kysely } from "kysely";
const ID = "varchar(30)";
const SMALL_VARVARCHAR = "varchar(30)";
const NORMAL_VARVARCHAR = "varchar(255)";
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("book")
    .addColumn("id", ID, (col) => col.primaryKey())
    .addColumn("title", NORMAL_VARVARCHAR, (col) => col.notNull())
    .addColumn("ISBN", SMALL_VARVARCHAR)
    .addColumn("published_at", "date", (col) => col.notNull())
    .execute();
}
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("book").execute();
}