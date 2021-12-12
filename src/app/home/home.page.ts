import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NetworkingService, SearchType } from '../networking.service';
import { HistoryService } from '../history.service';
import { NgForm } from '@angular/forms'
import { BookInfo } from '../Models/BookInfo';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  title: string;
  settingStyle: string = "visibility: hidden;  height: 0px;";
  count: number;
  settingsVisible: boolean = false;
  isLoading: boolean = false;
  searchReturned: boolean = false;
  displayBooks: boolean = true;
  typeStr: string = "";
  searchText: string = "Search for books";
  bookResults: any[] = [];
  authorResults: any[] = [];

  constructor(private network: NetworkingService, private his: HistoryService) {}

  ngOnInit(): void {
    
  }

  search(f: NgForm): void {
    if (!f.valid)
      return;

    if (!this.network.isQueryGood(f.value.query)) {
      alert("Query too short or too common.");
      return;
    }

    if (f.value.searchType === "regular") {
      this.network.searchOption = SearchType.REGULAR;
    } else if (f.value.searchType === "title") {
      this.network.searchOption = SearchType.TITLE;
    } else if (f.value.searchType === "author") {
      this.network.searchOption = SearchType.AUTHOR;
    } else if (f.value.searchType === "isbn") {
      this.network.searchOption = SearchType.ISBN;
    }

    if (f.value.searchCategory === "author") {
      this.network.searchAuthors(f.value.query).subscribe(
        res => {
          this.count = res.docs.length;
          this.typeStr = "authors";
          this.searchText = "Search for authors";
          this.searchReturned = true;
          this.displayBooks = false;
          this.authorResults = res.docs;
          //console.log(res);
        },
        err => {
          this.searchReturned = false;
          console.log(err);
        }
      );
    } else {
      this.network.searchBooks(f.value.query).subscribe(
        res => {
          this.count = res.docs.length;
          this.typeStr = "books";
          this.searchText = "Search for books";
          this.searchReturned = true;
          this.displayBooks = true;
          this.bookResults = res.docs;
          //console.log(res);
        },
        err => { 
          this.searchReturned = true;
          console.log(err);
        }
      );
    }
  }

  toggleSettingsVisibility(): void {
    this.settingsVisible = !this.settingsVisible;
    if (this.settingsVisible)
      this.settingStyle = "";
    else
      this.settingStyle = "visibility: hidden;  height: 0px;"
  }

  categoryClicked(event: Event): void {
    this.searchText = "Search for " + (event.target as HTMLElement).getAttribute("value");
  }

  viewBook(book: BookInfo): void {
    this.his.setLatestHistory({ authors: book.author_name, editions: book.edition_key });
  }

  viewAuthor(author: any): void {
    console.log(author);
  }
}
