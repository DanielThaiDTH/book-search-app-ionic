import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookInfo } from './Models/BookInfo';
import { AuthorInfo } from './Models/AuthorInfo';
import { BookDetail } from './Models/BookDetail';
import { EditionSummary } from './Models/EditionSummary';

const MAXLIMIT: number = 200;

export enum SearchType {
  REGULAR,
  TITLE,
  AUTHOR,
  ISBN
}

@Injectable({
  providedIn: 'root'
})
export class NetworkingService {

  searchRoot: string = "https://openlibrary.org/search.json?";
  limitOpt: string = "&limit=";
  langOpt: string  = "&language=";
  returnLimit: number = MAXLIMIT;

  authorRoot: string = "https://openlibrary.org/search/authors.json?";

  editionRoot: string = "https://openlibrary.org/api/books?bibkeys=";
  editionKeyType: string = ",OLID:";
  editionFormat: string = "&format=json&jscmd=data";
  EDLIMIT: number = 220;

  baseRoot = "https://openlibrary.org";

  searchOption: SearchType = SearchType.REGULAR;
  isBookSearch: boolean = true;

  queryOption = { 
    [SearchType.REGULAR]: "q=", 
    [SearchType.TITLE]: "title=",
    [SearchType.AUTHOR]: "author=",
    [SearchType.ISBN]: "isbn="
  };


  constructor(private client: HttpClient) { }


  searchBooks(query: string, lang: string = "eng"): Observable<any> {
    let url: string = this.searchRoot + this.queryOption[this.searchOption];
    url += query + this.limitOpt + this.returnLimit.toString() + this.langOpt + lang;
    return this.client.get(url).pipe(map(obj => {
      obj['searchTime'] = new Date();
      obj['docs'] = obj['docs'].filter(b => b['author_key']);
      obj['docs'] = obj['docs'].map(b => BookInfo.buildBookInfo(b));

      return obj;
    }));
  }


  searchAuthors(query: string): Observable<any> {
    let url: string = this.authorRoot + "q=" + query;
    return this.client.get(url).pipe(map(obj => {
      obj['docs'] = obj['docs'].map(a => AuthorInfo.buildAuthor(a));
      obj['searchTime'] = new Date();

      return obj;
    }));
  }


  /**
   * Key should contain /authors/[key] to work
   */
  searchWorksBy(key: string) {
    let url: string = this.baseRoot + key + "/works.json?" + this.limitOpt + this.returnLimit.toString();
    return this.client.get(url);
  }

  /**
   * Limited to 220 editions.
   */
  searchEditions(editionKeys: string[]): Observable<any> {
    let count: number = 0;
    let url: string = this.editionRoot;
    let initial: boolean = true;

    if (!Array.isArray(editionKeys)) {
      //console.log(editionKeys);
      return null;
    }

    editionKeys.forEach(key => {
      if (count < this.EDLIMIT) {
        if (initial) {
          url += "OLID:" + key;
          initial = false;
        } else {
          url += this.editionKeyType + key;
        }
        count++;
      } 
    });

    url += this.editionFormat;
    return this.client.get(url);
  }


  /**
   * Key must have '/books/' attached to the front.
   */
  queryEdition(key: string): Observable<any> {
    let url: string = this.baseRoot + key + ".json";
    return this.client.get(url);
  }


  /**
   * Key must have '/work/' in the front
   */
  async queryWork(key: string): Promise<BookDetail> {
    let url: string = this.baseRoot + key + ".json";

    let b = await this.client.get(url).pipe(map(obj => {
                    let book = BookDetail.buildBookDetail(obj);
                    console.log(book);
                    return book;
    })).toPromise();

    if (b.isRedirect()) {
      let redirect = b.getRedirect();
      console.log("Redirecting to " + redirect);
      b = await this.client.get(redirect).pipe(map(obj => {
                      let book = BookDetail.buildBookDetail(obj);
                      return book;
      })).toPromise();
    }

    return b;
  }

  /**
   * Must NOT have a '/author/' in the front of the key.
   */
  queryAuthor(key: string): Observable<any> {
    let url: string = this.baseRoot + "/authors/" + key + ".json";
    return this.client.get(url);
  }


  /** Obtains two lists, a list of edition keys and a list of author names. 
   *  Needed because author work search does not return compelte information.
   * 
   * Uses the Openlibrary work key as a parameter.
   * 
   * Two lists, the first being the edition keys under 'key', the second is the author names
   * under 'name'.
   */
  async getEditionsAndAuthors(work_key: string): Promise<any> {
    if (work_key.charAt(0) === '/') work_key = work_key.substring(7);
    let result = await this.searchBooks(work_key).toPromise();
    let returnLists: any = {};
    if (result) {
      if (!result.docs || result.docs.length === 0)
        throw new Error("Failed to get information");

      var info = result.docs[0];
      returnLists['key'] = info.edition_key;
      returnLists['name'] = info.author_name;

      return returnLists;
    } else {
      return null;
    }
  }


  isQueryGood(query: string): boolean {
    return query !== null && query.length >= 3 &&
           query.toLowerCase() !== "the" &&
           query.toLowerCase() !== "for";
  }
}
