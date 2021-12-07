

export class BookInfo {
    key: string;
    text: string[];
    type: string;
    title: string;
    edition_count: number; 
    edition_key: string[];
    first_publish_year: number;
    cover_edition_key: string;
    covers: string[];
    language: string[]; //Three letter code for language
    author_key: string[];
    author_name: string[];
    id_amazon: string[];
    id_goodreads: string[];
    id_wikidata: string[];
    person: string[];
    place: string[];
    subject: string[];
    time: string[];

    constructor() {}

    static buildBookInfo(src: any): BookInfo {
        let info: BookInfo = new BookInfo;

        info.key = src['key'];
        info.text = src['text'];
        info.type = src['type'];
        info.title = src['title'];
        info.edition_count = src['edition_count'];
        info.edition_key = src['edition_key'];
        info.first_publish_year = src['first_publish_year'];
        info.cover_edition_key = src['cover_edition_key'];
        info.covers = src['covers'];
        info.author_key = src['author_key'];
        info.author_name = src['author_name'];
        info.id_amazon = src['id_amazon'];
        info.id_goodreads = src['id_goodreads'];
        info.id_wikidata = src['id_wikidata'];
        info.person = src['person'];
        info.place = src['place'];
        info.subject = src['subject'];
        info.time = src['time'];

        return info;
    }
}