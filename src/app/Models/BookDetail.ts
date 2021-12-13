/** Stores detailed information about a book. */
export class BookDetail {
    UID: number;
    key: string;
    desc: string;
    type: any;
    location: string; //redirect location
    author_list: string[];
    title: string;
    covers: string[];
    subject_places: string[];
    subjects: string[];
    edition_keys: string[];
    first_publish_date: string;
    addTime: Date;

    constructor() { }

    /** Converts a description in the JSON response that may be a array or object to a 
     * plain string.
     */
    setUncleanValues(src: any): void {
        if (src['description'] && !Array.isArray(src['description'])) {
            this.desc = src['description']['value'];
        } else if (src['description'] && Array.isArray(src['description'])) {
            this.desc = src['description'][0];
        } else if (typeof (src['description']) === "string") {
            this.desc = src['description'];
        } else {
            this.desc = "";
        }
    }

    isRedirect(): boolean {
        if (!this.type || !(this.type["key"] === "/type/redirect"))
            return false;
        else if (this.type["key"] === "/type/redirect")
            return true;
        else
            return false;
    }

    getRedirect(): string {
        return (this.location) ? this.location : this.key;
    }

    addAuthor(author: string): void {
        this.author_list.push(author);
    }


    getAuthorStr(): string {
        let authors: string = "";

        this.author_list.forEach(a => authors += a +", ");

        if (authors.length > 2)
            return authors.substring(0, authors.length - 2);
        else
            return "";
    }


    getSubjectStr(): string {
        let subject_string: string = "";
        let subjects_count: number = this.subjects?.length ? this.subjects.length : 0;

        for (let i = 0; i < subjects_count; i++) {
            if (i > 0)
                subject_string += ", ";

            subject_string += this.subjects[i];
        }

        return subject_string;
    }


    getSubjectPlaces(): string {
        let place_string: string = "";
        let count: number = this.subject_places?.length? this.subject_places.length : 0;

        for (let i = 0; i < count; i++) {
            if (i > 0)
                place_string += ", ";

            place_string += this.subject_places[i];
        }

        return place_string;
    }

    getImgUrl(idx: number = 0): string {
        if (!this.covers || this.covers.length == 0)
            return "";

        return "https://covers.openlibrary.org/b/id/" + this.covers[idx] + "-L.jpg";
    }

    getDateString(): string {
        if (this.addTime) {
            return this.addTime.toLocaleDateString() + " " + this.addTime.toLocaleTimeString().split(' ')[0]
        } else {
            return "";
        }
    }

    static buildBookDetail(src: any): BookDetail {
        let detail: BookDetail = new BookDetail;

        detail.key = src['key'];
        detail.type = src['type'];
        detail.title = src['title'];
        detail.location = src['location'];
        detail.first_publish_date = src['first_publish_date'];
        detail.subjects = src['subjects'];
        detail.covers = src['covers'];

        console.log(src);
        detail.setUncleanValues(src);

        return detail;
    }

    /** Makes a empty book in cases where there is no response. */
    static makeEmpty(): BookDetail {
        let detail: BookDetail = new BookDetail;

        detail.UID = -1;
        detail.key = "";
        detail.desc = "";
        detail.type = "";
        detail.location = ""; //redirect location
        detail.author_list = [];
        detail.title = "";
        detail.covers = [];
        detail.subject_places = [];
        detail.subjects = [];
        detail.edition_keys = [];
        detail.first_publish_date = "";

        return detail;
    }
}