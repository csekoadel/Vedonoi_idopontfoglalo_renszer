import {TestBed} from '@angular/core/testing';

import {GyermekService} from './gyermek.service';

describe('GyermekService', () => {
  let service: GyermekService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GyermekService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
