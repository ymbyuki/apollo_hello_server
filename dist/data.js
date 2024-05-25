var Status;
(function (Status) {
    Status["READING"] = "READING";
    Status["READ"] = "READ";
    Status["UNREAD"] = "UNREAD";
})(Status || (Status = {}));
var Category;
(function (Category) {
    Category["FICTION"] = "FICTION";
    Category["TRAVEL"] = "TRAVEL";
    Category["HISTORY"] = "HISTORY";
    Category["SCIENCE"] = "SCIENCE";
    Category["BUSINESS"] = "BUSINESS";
    Category["ART"] = "ART";
    Category["MUSIC"] = "MUSIC";
})(Category || (Category = {}));
let bookShelf = {
    items: [
        {
            bookShelfItemId: "1",
            bookId: "1",
            status: "1",
        },
        {
            bookShelfItemId: "2",
            bookId: "2",
            status: "2",
        },
    ],
};
let status = [
    {
        bookShelfItemId: "1",
        readingStatus: Status.READING,
        comment: "TESTTEST",
        score: "5",
    },
    {
        bookShelfItemId: "2",
        readingStatus: Status.READ,
        comment: "TESTTEST",
        score: "3",
    },
];
let bookDb = [
    {
        id: "1",
        title: "ノンデザイナーズ・デザインブック",
        author: "Robin Williams",
        publisher: "マイナビ出版",
        isbn: "9784839983796",
        category: Category.ART,
        releaseDate: "2023/8/25",
    },
    {
        id: "2",
        title: "頭のいい人だけが解ける論理的思考問題",
        author: "TEST",
        publisher: "ダイヤモンド社",
        isbn: "9784478119044",
        category: Category.BUSINESS,
        releaseDate: "2024/3/27",
    },
];
export { bookShelf, status, bookDb };
