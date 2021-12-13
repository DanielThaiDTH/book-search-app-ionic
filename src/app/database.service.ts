import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BookDetail } from './Models/BookDetail';
import { AuthorInfo } from './Models/AuthorInfo';
import { SQLite, SQLiteObject } from '@ionic-enterprise/secure-storage/ngx';

//Unused, unable to startup

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  db: SQLiteObject;

  constructor(private platform: Platform, private sqlite: SQLite) {
    this.platform.ready().then(()=>this.init());
  }

  init(): void  {
    this.sqlite.create({
      name: "library.db",
      location: "default"
    }).then(created => {
      this.db = created;
      this.db.executeSql(`
          CREATE TABLE IF NOT EXISTS Book (
          ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
          desc TEXT DEFAULT '',
          title TEXT DEFAULT '' NOT NULL,
          author_list TEXT DEFAULT '',
          covers TEXT DEFAULT '',
          subject_places TEXT DEFAULT '',
          subjects TEXT DEFAULT '',
          edition_keys TEXT DEFAULT '',
          first_publish_date TEXT,
          addTime TEXT NOT NULL
          )`, []
      ).then(()=>{
        this.db.executeSql(`
          CREATE TABLE IF NOT EXISTS Author (
          ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
          name TEXT DEFAULT '' NOT NULL,
          biography TEXT DEFAULT '',
          birth_date TEXT DEFAULT '',
          death_date TEXT DEFAULT '',
          photos TEXT,
          addTime TEXT NOT NULL
          )`, []
          ).then().catch(err => {
            console.error(err);
            let keys = Object.keys(err);
            keys.forEach((k)=>alert(k));
            alert("Author table creation error");
          });
      }).catch(err => {
        console.error(err);
        let keys = Object.keys(err);
        keys.forEach((k) => alert(k));
        alert("Book table creation error");
      });
    }).catch(err => console.error(err));
  }

  loadAuthors(): Promise<Map<string, AuthorInfo>> {
    return new Promise(async (resolve, reject) =>{
      let authors: Map<string, AuthorInfo> = new Map<string, AuthorInfo>();
      await this.db.executeSql(`SELECT * FROM Author`, []
      ).then(res => {
        for (let i = 0; i < res.rows.length; i++) {
          let a: AuthorInfo = new AuthorInfo;
          
          a.key = res.row.item(i).key;
          a.name = res.row.item(i).name;
          a.biography = res.row.item(i).biography;
          a.birth_date = res.row.item(i).birth_date;
          a.death_date = res.row.item(i).death_date;
          a.photos = JSON.parse(res.row.item(i).photos);
          a.addTime = new Date(res.row.item(i).addTime);
  
          authors.set(a.key, a);
        }
        resolve(authors);
      }).catch(reject);
    });
  }

  loadBooks(): Promise<Map<string, BookDetail>> {
    return new Promise(async (resolve, reject) => {
      let books: Map<string, BookDetail> = new Map<string, BookDetail>();
      await this.db.executeSql(`SELECT * FROM Book`, []
      ).then(res => {
        for (let i = 0; i < res.rows.length; i++) {
          let b: BookDetail = new BookDetail;

          b.key = res.row.item(i).key;
          b.desc = res.row.item(i).desc;
          b.title = res.row.item(i).title;
          b.author_list = JSON.parse(res.row.item(i).author_list);
          b.subject_places = JSON.parse(res.row.item(i).subject_places);
          b.subjects = JSON.parse(res.row.item(i).subjects);
          b.edition_keys = JSON.parse(res.row.item(i).edition_keys);
          b.first_publish_date = res.row.item(i).first_publish_date;
          b.covers = JSON.parse(res.row.item(i).covers);
          b.addTime = new Date(res.row.item(i).addTime);

          books.set(b.key, b);
        }
        resolve(books);
      }).catch(reject);
    });
  }

  storeBook(book: BookDetail) {
    let data = [book.key, book.title, JSON.stringify(book.author_list), JSON.stringify(book.covers), JSON.stringify(book.subject_places),
    JSON.stringify(book.subjects), JSON.stringify(book.edition_keys), book.first_publish_date, book.addTime.toISOString()]
    this.db.executeSql(`
    INSERT INTO Book (key, desc, title, author_list, covers, subject_places, subjects, edition_keys, first_publish_date, addTime)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, data
    ).catch(err=>{
      console.error(err);
      let keys = Object.keys(err);
      keys.forEach((k) => alert(k));
      alert("Book insert error");
    });
  }

  storeAuthor(author: AuthorInfo) {
    let data = [author.key, author.name, author.biography, author.birth_date, author.death_date, JSON.stringify(author.photos), author.addTime.toISOString()]
    this.db.executeSql(`
    INSERT INTO Author (key, name, biography, birth_date, death_date, photos, addTime)
    values (?, ?, ?, ?, ?, ?, ?)`, data
    ).catch(err => {
      console.error(err);
      let keys = Object.keys(err);
      keys.forEach((k) => alert(k));
      alert("Author insert error");
    });
  }

  removeBook(key: string) {
    this.db.executeSql(`DELETE FROM Book WHERE key=?`, [key]).catch(err => {
      console.error(err);
      let keys = Object.keys(err);
      keys.forEach((k) => alert(k));
      alert("Book remove error");
    });
  }

  removeAuthor(key: string) {
    this.db.executeSql(`DELETE FROM Author WHERE key=?`, [key]).catch(err => {
      console.error(err);
      let keys = Object.keys(err);
      keys.forEach((k) => alert(k));
      alert("Author remove error");
    });
  }
}
