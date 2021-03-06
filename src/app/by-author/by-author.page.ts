import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkingService } from '../networking.service';
import { HistoryService } from '../history.service';


@Component({
  selector: 'app-by-author',
  templateUrl: './by-author.page.html',
  styleUrls: ['./by-author.page.scss'],
})
export class ByAuthorPage implements OnInit {

  results: any;
  name: string;
  key: string;

  constructor(private route: ActivatedRoute, private nav: Router, private his: HistoryService, private client: NetworkingService) { }

  ngOnInit() {
    this.name = this.route.snapshot.queryParams['name'];
    this.key = this.route.snapshot.queryParams['key'];

    if (this.key) {
      this.client.searchWorksBy(this.key).subscribe(
        res => {
          this.results = res;
          console.log(res);
        }
      );
    } else {
      console.error("No author key was provided in the query parameters.");
      alert("No author key was provided.");
    }
  }

  async bookClicked(book: any) {
    this.client.getEditionsAndAuthors(book.key)
    .then(res => {
      this.his.setLatestHistory({ authors: res.name, editions: res.key });
      this.nav.navigate(['/work-detail'], { queryParams: { key: book.key } });
    }).catch(err => {
      console.error(err);
      alert("Could not navigate");
    });
  }

}
