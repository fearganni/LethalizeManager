import { Component, OnInit } from '@angular/core';
import { GitHubAsset, GitHubRelease, RequestService } from '../../../core';

@Component({
  selector: 'app-development',
  templateUrl: './development.component.html',
  styles: [],
})
export class DevelopmentComponent implements OnInit {
  updates: any[] = [];

  constructor(private request: RequestService) {}

  ngOnInit(): void {
    this.request
      .get<GitHubRelease[]>(this.request.preset_urls.github_releases)
      .subscribe({
        next: (r: GitHubRelease[]) => {
          this.updates = r;
          console.log(this.updates);
        },
        error: (e) => this.request.error(e),
      });
  }

  getBackground(assets: GitHubAsset[]): string {
    const defaultImageUrl = 'assets/img/lethaliize/icon.webp';
    const backgroundAsset = assets.find((asset) =>
      asset.name.includes('background')
    );

    // Asserting that browser_download_url is a string if defined
    const backgroundImageUrl = backgroundAsset?.browser_download_url ;

    return `url(${backgroundImageUrl || defaultImageUrl})`;
  }
}
