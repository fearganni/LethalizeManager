import { AfterViewChecked, Component, OnInit } from '@angular/core';

import * as Headroom from 'headroom.js';

import { AppSettings } from '../../../core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent implements OnInit, AfterViewChecked {
  AppSettings = AppSettings;
  isMenuCollapsed = true;

  header: HTMLElement | null = null;
  headroom: Headroom | null = null;
  headerChecked = false;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    if (!this.headerChecked) {
      this.headerChecked = true;

      this.header = document.querySelector('header');

      this.headroom = this.header
        ? new Headroom(this.header, {
            offset: {
              up: 0,
              down: 0,
            },
            tolerance: 1000,
          })
        : null;

      if (this.headroom) {
        this.headroom.init();
        console.debug('Headroom init.');
      }
    }
  }
}
