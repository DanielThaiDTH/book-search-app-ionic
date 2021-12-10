

export class Edition {
    key: string;
    title: string;
    number_of_pages: number; 
    by_statement: string;
    publish_date: string;
    author_list: string[]; 

    //Keys: librarything, openlibrary, goodreads, amazon, isbn_10, isbn_13
    identifiers: any;
    librarything: string;
    openlibrary: string;
    goodreads: string;
    amazon: string; 
    isbn10: string; 
    isbn13: string; 

    addTime: Date; 

    constructor() { }

    //Call this after deserialization to flatten attributes
    flattenAttributes(): void {
        let temp: string[] = [];

        if (this.identifiers == null)
            return;

        if (this.identifiers["librarything"])
            this.librarything = this.identifiers["librarything"][0];
        if (this.identifiers["openlibrary"])
            this.openlibrary = this.identifiers["openlibrary"][0];
        if (this.identifiers["goodreads"])
            this.goodreads = this.identifiers["goodreads"][0];
        if (this.identifiers["amazon"])
            this.amazon = this.identifiers["amazon"][0];;
        if (this.identifiers["isbn_10"])
            this.isbn10 = this.identifiers["isbn_10"][0];
        if (this.identifiers["isbn_13"])
            this.isbn13 = this.identifiers["isbn_13"][0];
    }


    getGoodreadsURL(): string {
        if (!this.goodreads)
            return "";

        return "https://www.goodreads.com/book/show/" + this.goodreads;
    }

    GetLibrarythingURL(): string {
        if (!this.librarything)
            return "";

        return "https://www.librarything.com/work/" + this.librarything;
    }

    getAmazonURL(): string {
        if (!this.amazon)
            return "";

        return "https://www.amazon.com/dp/" + this.amazon;
    }

}
