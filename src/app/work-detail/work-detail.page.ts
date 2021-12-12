import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetworkingService } from '../networking.service';
import { HistoryService } from '../history.service';
import { BookDetail } from '../Models/BookDetail';


@Component({
  selector: 'app-work-detail',
  templateUrl: './work-detail.page.html',
  styleUrls: ['./work-detail.page.scss'],
})
export class WorkDetailPage implements OnInit {

  detail: BookDetail = BookDetail.makeEmpty();
  isSaved: boolean;

  constructor(private route: ActivatedRoute, private client: NetworkingService, private his: HistoryService) { }

  async ngOnInit() {
    let param = this.route.snapshot.queryParams['key'];
    if (param) {

      if (this.his.isBookSaved(param)) {
        console.log("Is saved " + param);
        this.isSaved = true;
      } else {
        console.log("Is not saved " + param);
        this.isSaved = false;
      }

      let cached = this.his.getCache(param);

      if (cached) {
        this.detail = cached;
      } else {

        try {
          this.detail = await this.client.queryWork(param);
          //console.log(this.detail);
        } catch (e) {
          alert("No resource retrieved from OpenLibrary: " + e.message);
          console.error(e);
          this.detail = BookDetail.makeEmpty();
        }

        let history = this.his.getLatestHistory();
        this.detail.author_list = history.authors;
        this.detail.edition_keys = history.editions;

        this.his.addToCache(this.detail);
      }

      
      //console.info(this.detail.edition_keys);

    } else {
      console.error("No key provided");
    }
  }

  viewEditionsClicked(): void {
    console.log("Edition clicked");
    console.warn(this.detail.edition_keys);
    this.his.setLatestHistory({ editions: this.detail.edition_keys });
  }

  saveBook(): void {
    if (!this.his.isBookSaved(this.detail.key)) {
      this.his.saveBook(this.detail);
      this.isSaved = true;
    }
  }

  deleteBook(): void {
    if (this.his.isBookSaved(this.detail.key)) {
      this.his.removeBook(this.detail.key);
      this.isSaved = false;
    }
  }
}
