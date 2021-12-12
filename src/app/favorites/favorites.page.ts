import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoryService } from '../history.service';
import { BookDetail } from '../Models/BookDetail';
import { AuthorInfo } from '../Models/AuthorInfo'; 
import { Subscription } from 'rxjs';
import { NetworkingService } from '../networking.service';

enum TabType { BOOK = "book", AUTHOR = "author" }

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

  constructor(private router: Router, 
    private client: NetworkingService, 
    private his: HistoryService) { }

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

  tabChanged(event: any) {
    if (event.detail.value === "book") {
      this.selectedTab = TabType.BOOK;
    } else if (event.detail.value === "author") {
      this.selectedTab = TabType.AUTHOR;
    }
  }

  async goToBook(book: BookDetail) {
    this.client.getEditionsAndAuthors(book.key)
      .then(res => {
        this.his.setLatestHistory({ authors: res.name, editions: res.key });
        this.router.navigate(['/work-detail'], { queryParams: { key: book.key } });
      }).catch(err => {
        console.error(err);
        alert("Could not navigate");
      });
  }

  ngOnDestroy(): void {
    this.bookSub.unsubscribe();
    this.authorSub.unsubscribe();
  }
}
