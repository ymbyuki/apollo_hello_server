enum Status {
  READING = "READING",
  READ = "READ",
  UNREAD = "UNREAD",
}

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

export interface BookCreateInput {
  title: string;
  author: string;
  publisher: string;
  isbn?: string | null;
  category: Category;
  releaseDate: Date;
}

export interface BookStatusInput {
  readingStatus: Status,
  review: {
    score: number,
    comment: string;
  }
}

export interface AuthorInput {
  name: string;
}