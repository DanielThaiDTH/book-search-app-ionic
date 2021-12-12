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
  isSaved: boolean;
  
  constructor(private route: ActivatedRoute, private client: NetworkingService, private his: HistoryService) { }

  ngOnInit() {
    this.key = this.route.snapshot.queryParams['key'];
    if (this.key.charAt(0) === "/") {
      this.key = this.key.substring(9);
    }

    if (this.key) {

      if (this.his.isAuthorSaved("/authors/" + this.key)) {
        console.log("Is saved " + this.key);
        this.isSaved = true;
      } else {
        console.log("Is not saved " + this.key);
        this.isSaved = false;
      }

      let cached = this.his.getCache("/authors/" + this.key);

      if (cached) {
        console.log("Got cached page");
        this.author = cached;
      } else {
        this.client.queryAuthor(this.key).subscribe(
          res =>{
            this.author = AuthorInfo.buildAuthor(res);
            this.author.setUncleanValues(res);
            this.his.addToCache(this.author);
          }
        );
      }

    } else {
      console.error("No author key was provided in the path.");
      alert("No author key was provided.");
    }
  }


  saveAuthor(): void {
    if (!this.his.isAuthorSaved(this.author.key)) {
      this.author.addTime = new Date();
      this.his.saveAuthor(this.author);
      //console.log(this.author.key);
      this.isSaved = true;
    }
  }

  deleteAuthor(): void {
    if (this.his.isAuthorSaved(this.author.key)) {
      this.his.removeAuthor(this.author.key);
      this.isSaved = false;
    }
  }
}
