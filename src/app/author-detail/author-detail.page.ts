import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NetworkingService } from '../networking.service';
import { HistoryService } from '../history.service';
import { AuthorInfo } from '../Models/AuthorInfo';

@Component({
  selector: 'app-author-detail',
  templateUrl: './author-detail.page.html',
  styleUrls: ['./author-detail.page.scss'],
})
export class AuthorDetailPage implements OnInit {

  author: AuthorInfo;
  key: string;
  
  constructor(private route: ActivatedRoute, private client: NetworkingService, private his: HistoryService) { }

  ngOnInit() {
    this.key = this.route.snapshot.queryParams['key'];
    if (this.key) {
      this.client.queryAuthor(this.key).subscribe(
        res =>{
          this.author = AuthorInfo.buildAuthor(res);
          this.author.setUncleanValues(res);
        }
      );
    } else {
      console.error("No author key was provided in the path.");
      alert("No author key was provided.");
    }
  }

}
