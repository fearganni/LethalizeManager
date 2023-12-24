import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { RequestService } from '../request/request.service';
import { ModInfo } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ThunderstoreService {
  public ThunderstoreDataOb: Observable<ModInfo[]>;
  public ThunderstoreData: BehaviorSubject<ModInfo[]>;

  constructor(private request: RequestService) {
    this.ThunderstoreData = new BehaviorSubject<ModInfo[]>([]);
    this.ThunderstoreDataOb = this.ThunderstoreData.asObservable();
  }

  update(): void {
    this.request
      .get<ModInfo[]>(this.request.preset_urls.thunderstore_api)
      .subscribe({
        next: (r: ModInfo[]) => {
          this.ThunderstoreData.next(r);
        },
        error: (e: any) => this.request.error(e),
      });
  }
}
