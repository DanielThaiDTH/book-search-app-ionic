import { Component, OnInit } from '@angular/core';
import { EditionSummary } from '../Models/EditionSummary';
import { ActivatedRoute } from '@angular/router';
import { NetworkingService } from '../networking.service';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-edition-list',
  templateUrl: './edition-list.page.html',
  styleUrls: ['./edition-list.page.scss'],
})
export class EditionListPage implements OnInit {

  editions: EditionSummary[];
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private his: HistoryService, private client: NetworkingService) { }

  async ngOnInit() {
    let ed = this.his.getLatestHistory().editions;

    this.client.searchEditions(ed).subscribe(
      res => {
        console.log(res);
        let keys: string[] = Object.keys(res);
        this.editions = keys.map(k=>{
          let ed: EditionSummary = new EditionSummary();
          Object.assign(ed, res[k]);
          ed.flattenAttributes();

          return ed;
        });
        this.isLoading = false;
        console.log(this.editions);
      },
      err => {
        console.log(err);
        alert("Unable to retrieve list of editions.");
      }
    );
  }

}
