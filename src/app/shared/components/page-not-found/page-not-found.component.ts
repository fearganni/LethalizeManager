import { Component, OnDestroy, OnInit } from '@angular/core';

import { AppSettings } from '../../../core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  AppSettings = AppSettings;

  swiperGradient = '89, 20, 20';
  swiperBG = `linear-gradient(180deg, rgba(${this.swiperGradient}, 0) 0%, rgba(${this.swiperGradient}, 0.8) 75%, rgba(${this.swiperGradient}, 0.9) 100%)`;

  constructor() {
    this.AppSettings.appEmpty = true;
  }

  ngOnInit(): void {
    console.log('PageNotFoundComponent INIT');
  }

  ngOnDestroy(): void {
    this.AppSettings.appEmpty = false;
  }
}
