import {TestBed} from '@angular/core/testing';

import {IdopontfoglalasService} from './idopontfoglalas.service';

describe('IdopontfoglalasService', () => {
  let service: IdopontfoglalasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdopontfoglalasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
