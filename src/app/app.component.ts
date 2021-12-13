import { Component } from '@angular/core';
import { HistoryService } from './history.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  viewable: boolean = false;
  constructor(private his: HistoryService) {
    this.his.init().then(res => this.viewable = res);
  }
}
