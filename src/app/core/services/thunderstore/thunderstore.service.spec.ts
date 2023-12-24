import { TestBed } from '@angular/core/testing';

import { ThunderstoreService } from './thunderstore.service';

describe('ThunderstoreService', () => {
  let service: ThunderstoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThunderstoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
