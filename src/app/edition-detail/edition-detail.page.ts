import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { ActivatedRoute } from '@angular/router';

import { EditionSummary } from '../Models/EditionSummary';
import { NetworkingService } from '../networking.service';
import { HistoryService } from '../history.service';
import { EditionDetail } from '../Models/EditionDetail';


@Component({
  selector: 'app-edition-detail',
  templateUrl: './edition-detail.page.html',
  styleUrls: ['./edition-detail.page.scss'],
})
export class EditionDetailPage implements OnInit {

  key: string;
  pages: string;
  edition: EditionDetail;

  constructor(private route: ActivatedRoute, private client: NetworkingService) { }

  async ngOnInit() {
    let param = this.route.snapshot.queryParams['key'];
    this.key = param;
    if (param) {
      try {
        this.client.queryEdition(param).subscribe(
          res => {
            this.edition = new EditionDetail;
            Object.assign(this.edition, res);
            this.edition.flattenAttributes();
            console.log(this.edition);
          },
          err => {
            console.error(err);
            alert("Error retrieveing data from OpenLibrary.");
          }
        );
        
      } catch (e) {
        alert("No resource retrieved from OpenLibrary: " + e.message);
        console.error(e);
      }
    } else {
      console.error("No key given in the query parameters.");
      alert("Editon key was not given.");
    }
  }

  
  async openLink(e: Event) {
    let link: string = (e.target as HTMLElement).innerText;
    if (link.length > 11) // (http://www.)(.aa)
      await Browser.open({ url: link });
  }
}
