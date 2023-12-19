import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../core';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styles: [],
})
export class UpdatesComponent implements OnInit {
  updates: any[] = [];

  constructor(private request: RequestService) {}

  ngOnInit(): void {
    this.request
      .get<any[]>(this.request.preset_urls.github_releases)
      .subscribe({
        next: (r: any[]) => (this.updates = r),
        error: (e) => this.request.error(e),
      });
  }

  getBackground(assets: any[]): any | string | null {
    const findBackground = assets.find((item) =>
      item.name.includes('background')
    );

    return `url(${
      findBackground
        ? findBackground.browser_download_url
        : 'assets/img/lethaliize/icon.webp'
    })`;
  }
}
