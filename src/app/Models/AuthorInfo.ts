export class AuthorInfo {
    key: string;
    name: string;
    bio: any; //Original key of the biography, could be an array, object or plain string
    biography: string;
    birth_date: string;
    death_date: string;
    photos: number[];
    addTime: Date;

    constructor() {}

    getImgUrl(idx: number = 0): string {
        if (!this.photos || this.photos.length == 0)
            return "";

        return "https://covers.openlibrary.org/a/id/" + this.photos[idx] + ".jpg";
    }

    setUncleanValues(src: any): void {
        if (src['bio'] && !Array.isArray(src['bio'])) {
            this.biography = src['bio']['value'];
        } else if (src['bio'] && Array.isArray(src['bio'])) { 
            this.biography = src['bio'][0];
        } else if (typeof (src['bio']) === "string") {
            this.biography = src['bio'];
        } else {
            this.biography = "";
        }
    }

    static buildAuthor(src: any): AuthorInfo {
        let author: AuthorInfo = new AuthorInfo;

        author.key = src['key'];
        author.name = src['name'];
        author.birth_date = src['birth_date'];
        author.death_date = src['death_date'];
        author.photos = src['photos'];

        author.setUncleanValues(src);

        return author;
    }
}