import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  latest: any;

  constructor() { }

  setLatestHistory(obj: any)
  {
    this.latest = {...obj};
  }

  getLatestHistory(): any
  {
    return this.latest;
  }
}
