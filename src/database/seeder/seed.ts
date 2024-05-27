enum Category {
  FICTION = "FICTION",
  TRAVEL = "TRAVEL",
  HISTORY = "HISTORY",
  SCIENCE = "SCIENCE",
  BUSINESS = "BUSINESS",
  ART = "ART",
  MUSIC = "MUSIC",
  OTHER = "OTHER",
}

interface BookCreateInput {
  title: string;
  authorId: number;
  publisher: string;
  isbn?: string | null;
  category: Category;
  releaseDate: string;
}

interface BookStatusInput {
  readingStatus: ReadingStatus,
  review: {
    score: number,
    comment: string;
  }
}

interface BookShelfItem {
  items: {
    bookId: number;
    statusId: number;
  }[];
}

let bookShelf: BookShelfItem = {
  items: [
    {
      bookId: 1,
      statusId: 1,
    },
    {
      bookId: 2,
      statusId: 2,
    },
  ],
};



let status = [
  {
    readingStatusId: 1,
    comment: "TESTTEST",
    score: "5",
  },
  {
    readingStatusId: 2,
    comment: "TESTTEST",
    score: "3",
  },
];

let bookDb: BookCreateInput[] = [
  {
    title: "ノンデザイナーズ・デザインブック",
    authorId: 1,
    publisher: "マイナビ出版",
    isbn: "9784839983796",
    category: Category.ART,
    releaseDate: "2023/8/25",
  },
  {
    title: "頭のいい人だけが解ける論理的思考問題",
    authorId: 2,
    publisher: "ダイヤモンド社",
    isbn: "9784478119044",
    category: Category.BUSINESS,
    releaseDate: "2024/3/27",
  },
];


let author = [
  {
    name: "Robin Williams",
  },
  {
    name: "TEST",
  },
]

enum ReadingStatus {
  READING = "READING",
  READ = "READ",
  UNREAD = "UNREAD",
}
const reading_status = [
  {
    status: ReadingStatus.READING,
  },
  {
    status: ReadingStatus.READ,
  },
  {
    status: ReadingStatus.UNREAD,
  },
];


import { db } from '../database'

const seed = async () => {
  const tables = (await db.introspection.getTables()).map(
    (t) => t.name as any
  );
  await Promise.all(tables.map((t) => db.deleteFrom(t as any).execute()));
  await db.insertInto('author_tbl').values(author).execute()
  await db.insertInto('book_tbl').values(bookDb).execute()
  await db.insertInto('reading_status_tbl').values(reading_status).execute()
  await db.insertInto('status_tbl').values(status).execute()
  await db.insertInto('book_shelf_tbl').values(bookShelf.items).execute()
}

seed()
  .then(() => console.log('seeded'))
  .catch((e) => console.error(e))