import {TestBed} from '@angular/core/testing';

import {VedonoService} from './vedono.service';

describe('VedonoService', () => {
  let service: VedonoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VedonoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
