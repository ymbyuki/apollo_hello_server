import { Kysely, sql } from "kysely";
import { NORMAL_VARVARCHAR, SMALL_VARVARCHAR } from "./const";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("book_tbl")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", NORMAL_VARVARCHAR, (col) => col.notNull())
    .addColumn("authorId", "integer", (col) => col.references('author_tbl.id').onDelete("cascade").notNull())
    .addColumn("isbn", SMALL_VARVARCHAR, (col) => col.notNull())
    .addColumn("publisher", NORMAL_VARVARCHAR, (col) => col.notNull())
    .addColumn("category", SMALL_VARVARCHAR, (col) => col.notNull())
    .addColumn("release_date", "date", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .addCheckConstraint("category", sql`category IN ('FICTION', 'TRAVEL', 'HISTORY', 'SCIENCE', 'BUSINESS', 'ART', 'MUSIC', 'OTHER')`)
    .addCheckConstraint('isbn', sql`CHAR_LENGTH(isbn) = 13 or CHAR_LENGTH(isbn) = 10`)
    .execute();

  await db.schema
    .createTable("book_shelf_tbl")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("bookId", "integer", (col) => col.references("book_tbl.id").onDelete("cascade").notNull())
    .addColumn("statusId", "integer", (col) => col.references("status_tbl.id").onDelete("cascade").notNull())
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  await db.schema
    .createTable("status_tbl")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    // .addColumn("book_shelf_item_id", "integer", (col) => col.notNull())
    .addColumn("reading_status_id", "text", (col) => col.references('reading_status_tbl.id').onDelete("cascade").notNull())
    .addColumn("comment", 'text', (col) => col.notNull())
    .addColumn("score", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .addCheckConstraint("score", sql`score BETWEEN 1 AND 5`)
    .execute();

    await db.schema
    .createTable('reading_status_tbl')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('status', 'text', (col) => col.notNull())
    .execute();

    await db.schema
    .createTable('author_tbl')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("book_tbl").execute();
  await db.schema.dropTable("bookShelf_tbl").execute();
  await db.schema.dropTable("status_tbl").execute();
  await db.schema.dropTable("readingStatus_tbl").execute();
  await db.schema.dropTable("author_tbl").execute();
}
