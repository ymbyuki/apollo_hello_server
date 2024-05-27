// import { Database } from './types.ts' // this is the Database interface we defined earlier
import { createPool } from 'mysql2' // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect, CamelCasePlugin } from 'kysely'

const dialect = new MysqlDialect({
  pool: createPool({
    database: 'api',
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    connectionLimit: 10,
  })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
export const db = new Kysely<any>({
  dialect,
  plugins: [new CamelCasePlugin()]
})