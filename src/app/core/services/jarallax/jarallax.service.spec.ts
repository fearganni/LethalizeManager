import { TestBed } from '@angular/core/testing';

import { JarallaxService } from './jarallax.service';

describe('JarallaxService', () => {
  let service: JarallaxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JarallaxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
