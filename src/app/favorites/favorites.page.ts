import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from '../history.service';
import { BookDetail } from '../Models/BookDetail';
import { AuthorInfo } from '../Models/AuthorInfo'; 
import { Subscription } from 'rxjs';

enum TabType { BOOK, AUTHOR }

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  savedAuthors: AuthorInfo[] = [];
  savedBooks: BookDetail[] = [];
  selectedTab: TabType = TabType.BOOK;
  bookSub: Subscription;
  authorSub: Subscription;

  constructor(private route: ActivatedRoute, private his: HistoryService) { }

  ngOnInit() {
    this.bookSub = this.his.getBooks().subscribe(
      res => {
        this.savedBooks = res;
      }
    );

    this.authorSub = this.his.getAuthors().subscribe(
      res => {
        this.savedAuthors = res;
      }
    );

    console.log(this.savedBooks);
    console.log(this.savedAuthors);
  }


  ngOnDestroy(): void {
    this.bookSub.unsubscribe();
    this.authorSub.unsubscribe();
  }
}
