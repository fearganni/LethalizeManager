import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import {
  ElectronService,
  GitHubRelease,
  GitHubRepo,
  ModInfo,
  RequestService,
  ThunderstoreService,
} from '../../../core';

@Component({
  selector: 'app-mod',
  templateUrl: './mod.component.html',
  styles: [],
})
export class ModComponent implements OnInit {
  owner: string | null = null;
  name: string | null = null;

  mod: ModInfo | null | undefined = null;

  github_repo: GitHubRepo | null = null;
  github_readme: string | null = null;
  github_releases: GitHubRelease[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private request: RequestService,
    private toastr: ToastrService,
    private thunderstoreService: ThunderstoreService,
    private electronService: ElectronService
  ) {}

  ngOnInit(): void {
    this.owner = this.route.snapshot.paramMap.get('owner');
    this.name = this.route.snapshot.paramMap.get('name');

    if (this.owner === null || this.name === null) {
      // should redirect back to the /mods
      this.returnToMods();
    } else {
      this.thunderstoreService.ThunderstoreData.subscribe({
        next: (r: ModInfo[]) => {
          if (typeof r !== undefined && r.length > 0) {
            this.mod = r.find(
              (item) => item.owner === this.owner && item.name === this.name
            );

            if (this.mod && this.mod.versions && this.mod.versions.length > 0) {
              const latest = this.mod.versions.at(0);
              if (latest?.website_url.includes('github.com')) {
                const githubPath = latest.website_url.replace(
                  'https://github.com/',
                  ''
                );

                const repoUrl = `https://api.github.com/repos/${githubPath}`;
                const readmeUrl = `https://raw.githubusercontent.com/${githubPath}/master/README.md`;
                const releasesUrl = `https://api.github.com/repos/${githubPath}/releases`;

                forkJoin({
                  repo: this.request.get<GitHubRepo>(repoUrl),
                  readme: this.request.get<string>(readmeUrl, 'text'),
                  releases: this.request.get<GitHubRelease[]>(releasesUrl),
                })
                  .pipe(
                    catchError((error) => {
                      this.request.error(error);
                      return [];
                    })
                  )
                  .subscribe({
                    next: ({ repo, readme, releases }) => {
                      this.github_repo = repo;
                      this.github_readme = readme;
                      this.github_releases = releases;
                      console.log(this.github_repo, this.github_releases);
                    },
                  });
              }
            }
          }
        },
        error: (e: unknown) => this.request.error(e),
      });
    }
  }

  returnToMods(): void {
    this.router.navigate(['/mods']).catch((e) => console.error(e));
  }

  statisticFormat(n: number | undefined): string {
    if (typeof n === 'number') {
      return new Intl.NumberFormat('en-GB', {
        notation: 'compact',
        compactDisplay: 'short',
      })
        .format(n)
        .replace('T', 'K');
    }

    return '0';
  }

  downloadFile(
    event: Event,
    fileUrl: string | undefined,
    fileName: string | undefined
  ): void {
    console.dirxml(event);

    if (this.electronService.isElectron) {
      if (fileUrl && fileName) {
        // Create a new listener for download progress
        this.electronService.downloadProgress();

        // Send our download request
        this.electronService.downloadFile(fileUrl, `${fileName}.zip`);
      }
    } else {
      this.toastr.warning(
        "You can now download, extract, install or update files when you're not running the Lethalize application. Please download that first.",
        'Not on the app!'
      );
    }
  }
}
