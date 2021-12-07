import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { NetworkingService } from './networking.service';

describe('NetworkingService', () => {
  let service: NetworkingService;
  let httpSpy: jasmine.SpyObj<HttpClient>

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new NetworkingService(httpSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Connection test', (done: DoneFn) => {
    httpSpy.get.and.returnValue(of({a: "a"}));
    service.searchBooks("the lord of the rings").subscribe(
      res => {
        expect(res).toBeTruthy();
        done();
      },
      done.fail
    );
  });

});
