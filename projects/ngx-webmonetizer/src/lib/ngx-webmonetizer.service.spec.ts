import { TestBed } from '@angular/core/testing';

import { NgxWebmonetizerService } from './ngx-webmonetizer.service';

describe('NgxWebmonetizerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxWebmonetizerService = TestBed.get(NgxWebmonetizerService);
    expect(service).toBeTruthy();
  });
});
