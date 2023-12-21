import { AfterViewChecked, Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { register } from 'swiper/element/bundle';

import { APP_CONFIG } from '../environments/environment';

import { AppSettings, ElectronService, JarallaxService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked {
  AppSettings = AppSettings;

  constructor(
    private router: Router,

    private lb: LoadingBarService,
    private translate: TranslateService,
    private electronService: ElectronService,
    private jarallaxService: JarallaxService
  ) {
    this.translate.setDefaultLang('en');
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  ngOnInit(): void {
    // Get the state of our loading bar
    const state = this.lb.useRef('router');

    // Wait for routing updates
    this.router.events.subscribe({
      next: (r) => {
        if (r instanceof NavigationStart) {
          state.start();
        } else if (
          r instanceof NavigationCancel ||
          r instanceof NavigationError ||
          r instanceof NavigationEnd
        ) {
          setTimeout(() => {
            state.complete();
          }, 250);
        }
      },
    });
  }

  ngAfterViewChecked(): void {
    this.jarallaxService.jarallaxAll();
    register();
  }
}
