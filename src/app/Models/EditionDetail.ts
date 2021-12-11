import { Edition } from './Edition'

/**Contains detailed information about a book edition. Extends Edition. */
export class EditionDetail extends Edition {
    subtitle: string;
    publishers: string[];
    publish_places: string[];
    covers: number[];
    subject_place: string[];
    isbn_10: string[];
    isbn_13: string[];
    genres: string[];

    //Key: key
    languages: any[];
    language: string;

    constructor() {
        super();
    }

    flattenAttributes(): void {
        super.flattenAttributes();
        this.isbn10 = this.isbn_10 ? this.isbn_10[0] : "";
        this.isbn13 = this.isbn_13 ? this.isbn_13[0] : "";

        if (this.languages && this.languages.length > 0 && this.languages[0].key)
            this.language = this.languages[0].key.substring(11); //Removes relative path '/languages/'
    }


    getImgURL(idx: number = 0): string {
        if (this.covers && this.covers.length >= 1)
            return "https://covers.openlibrary.org/b/id/" + this.covers[idx] + "-L.jpg";
        else
            return "";
    }

    generateCommaSeperated(string_list: string[]) {
        if (!string_list || string_list.length == 0)
            return "";

        let commaStr: string = "";

        string_list.forEach(str => commaStr += str + ", ");

        if (commaStr.length > 2)
            return commaStr.substring(0, commaStr.length - 2);
        else
            return "";
    }

    /** Returns comma separated values of publishers */
    getPublishersCS(): string {
        return this.generateCommaSeperated(this.publishers);
    }

        /**Gets comma seperated string of publish locations */
    getPublishLocationsCS(): string {
        return this.generateCommaSeperated(this.publish_places);
    }

    /**Comma separated list of authors*/
    getAuthorsCS(): string {
        return this.generateCommaSeperated(this.author_list);
    }

    /**Comma separated list of genres*/
    getGenresCS(): string {
        return this.generateCommaSeperated(this.genres);
    }

    getISBNs(): string {
        let text: string = "";

        if (this.isbn10)
            text += this.isbn10;
        if (this.isbn10 && this.isbn13)
            text += ", ";
        if (this.isbn13 != null)
            text += this.isbn13;

        return text;
    }
}