import { Inject, Injectable } from '@angular/core';

import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var jarallax: any;

@Injectable({
  providedIn: 'root',
})
export class JarallaxService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  jarallaxAll() {
    if (isPlatformBrowser(this.platformId)) {
      jarallax(document.querySelectorAll('.jarallax'), {});
    }
  }
}
