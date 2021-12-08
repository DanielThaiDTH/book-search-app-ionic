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

  constructor(private route: ActivatedRoute, private client: NetworkingService, private his: HistoryService) { }

  async ngOnInit() {
    let param = this.route.snapshot.queryParams['key'];
    if (param) {

      try {
        this.detail = await this.client.queryWork(param);
        console.log(this.detail);
      } catch (e) {
        alert("No resource retrieved from OpenLibrary: " + e.message);
        console.error(e);
        this.detail = BookDetail.makeEmpty();
      }

      let history = this.his.getLatestHistory();
      this.detail.author_list = history.authors;
      this.detail.edition_keys = history.editions;

    } else {
      console.error("No key provided");
    }
  }


}
