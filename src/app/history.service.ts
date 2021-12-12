import { Injectable } from '@angular/core';
import { BookDetail } from './Models/BookDetail';
import { AuthorInfo } from './Models/AuthorInfo';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

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

  init(): void {

  }

  setLatestHistory(obj: any) {
    this.latest = { ...obj };
  }

  getLatestHistory(): any {
    return this.latest;
  }

  saveBook(book: BookDetail): void {
    this.savedBooks.set(book.key, book);
    this.savedBooksSubject.next(Array.from(this.savedBooks.values()));
  }

  saveAuthor(author: AuthorInfo): void {
    this.savedAuthors.set(author.key, author);
    this.savedAuthorsSubject.next(Array.from(this.savedAuthors.values()));
  }

  removeBook(key: string): void {
    this.savedBooks.delete(key);
    this.savedBooksSubject.next(Array.from(this.savedBooks.values()));
  }
  
  removeAuthor(key: string): void {
    this.savedAuthors.delete(key);
    this.savedAuthorsSubject.next(Array.from(this.savedAuthors.values()));
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
