import { Injectable } from '@angular/core';
import { BookDetail } from './Models/BookDetail';
import { AuthorInfo } from './Models/AuthorInfo';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@capacitor/storage';
// import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  latest: any;
  savedBooks: Map<string, BookDetail>;
  savedAuthors: Map<string, AuthorInfo>;
  savedBooksSubject: BehaviorSubject<BookDetail[]> = new BehaviorSubject([]); //Needed because 
  savedAuthorsSubject: BehaviorSubject<AuthorInfo[]> = new BehaviorSubject([]);;
  cache: any[];
  CACHELIMIT: number = 20;

  constructor() { 
    this.cache = [];
    this.savedBooks = new Map<string, BookDetail>();
    this.savedAuthors = new Map<string, AuthorInfo>();
  }

  async init() {
    {
      const { value } = await Storage.get( {key: 'books'} );
      
      if (value && Object.keys(JSON.parse(value)).length > 0) {
        // let keys = Object.keys(value);
        // keys.forEach(k => this.savedBooks.set(k, value[k]));
        let obj = JSON.parse(value);
        let keys = Object.keys(obj);
        keys.forEach(k => {
          let b: BookDetail = new BookDetail();
          let bkeys = Object.keys(obj[k]);
          bkeys.forEach(bk => {
            if (bk === 'addTime') {
              b[bk] = new Date(obj[k][bk]);
            } else {
              b[bk] = obj[k][bk];
            }
          });
          this.savedBooks.set(k, b);
        });
        let arr = Array.from(this.savedBooks.values());
         if (Array.isArray(arr))
           this.savedBooksSubject.next(arr);
      }
    }

    {
      const { value } = await Storage.get({ key: 'authors' });
      if (value && Object.keys(JSON.parse(value)).length > 0) {
        let obj = JSON.parse(value);
        let keys = Object.keys(obj);
        keys.forEach(k => {
          let a: AuthorInfo = new AuthorInfo();
          let akeys = Object.keys(obj[k]);
          akeys.forEach(ak => {
            if (ak === 'addTime') {
              a[ak] = new Date(obj[k][ak]); //Date needs special handling
            } else {
              a[ak] = obj[k][ak];
            }
          });
          this.savedAuthors.set(k, a);
        });
        let arr = Array.from(this.savedAuthors.values());
        if (Array.isArray(arr))
          this.savedAuthorsSubject.next(arr);
      }
    }

    return true;
  }

  setLatestHistory(obj: any) {
    this.latest = { ...obj };
  }

  getLatestHistory(): any {
    return this.latest;
  }

  updateBooks(): any {
    let obj = {};
    for (const key of this.savedBooks.keys()) {
      obj[key] = this.savedBooks.get(key);
    }

    console.log(obj);

    return obj;
  }

  updateAuthors(): any {
    let obj = {};
    for (const key of this.savedAuthors.keys()) {
      obj[key] = this.savedAuthors.get(key);
    }

    console.log(obj);

    return obj;
  }

  saveBook(book: BookDetail): void {
    this.savedBooks.set(book.key, book);
    this.savedBooksSubject.next(Array.from(this.savedBooks.values()));
    Storage.set({ key: 'books', value: JSON.stringify(this.updateBooks()) });
  }

  saveAuthor(author: AuthorInfo): void {
    this.savedAuthors.set(author.key, author);
    this.savedAuthorsSubject.next(Array.from(this.savedAuthors.values()));
    Storage.set({ key: 'authors', value: JSON.stringify(this.updateAuthors()) });
  }

  removeBook(key: string): void {
    this.savedBooks.delete(key);
    this.savedBooksSubject.next(Array.from(this.savedBooks.values()));
    Storage.set({ key: 'books', value: JSON.stringify(this.updateBooks()) });
  }
  
  removeAuthor(key: string): void {
    this.savedAuthors.delete(key);
    this.savedAuthorsSubject.next(Array.from(this.savedAuthors.values()));
    Storage.set({ key: 'authors', value: JSON.stringify(this.updateAuthors()) });
  }

  getBooks(): BehaviorSubject<BookDetail[]> {
    return this.savedBooksSubject;
  }

  getAuthors(): BehaviorSubject<AuthorInfo[]> {
    return this.savedAuthorsSubject;
  }

  isBookSaved(key: string): boolean {
    return this.savedBooks.has(key);
  }

  isAuthorSaved(key: string): boolean {
    return this.savedAuthors.has(key);
  }

  addToCache(obj: any) {
    let found: boolean = false;
    let foundIdx: number = -1;

    for (let i = 0; i < this.cache.length && !found; i++) {
      if (obj['key'] === this.cache[i]['key']) {
        found = true;
        foundIdx = i;
      }
    }

    if (!found) {
      this.cache.push(obj);
      if (this.cache.length === this.CACHELIMIT) 
        this.cache.splice(0, 1); //Remove oldest
    } else {
      //swap
      [this.cache[this.cache.length - 1], this.cache[foundIdx]] = [this.cache[foundIdx], this.cache[this.cache.length - 1]]
    }
  }

  getCache(key: string): any {
    let res = null;

    for (let i = 0; i < this.cache.length && !res; i++) {
      if (key === this.cache[i]['key']) {
        res = this.cache[i];
      }
    }

    return res;
  }
}
