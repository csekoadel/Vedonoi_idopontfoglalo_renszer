import {TestBed} from '@angular/core/testing';

import {ElerhetosegService} from './elerhetoseg.service';

describe('ElerhetosegService', () => {
  let service: ElerhetosegService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElerhetosegService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
