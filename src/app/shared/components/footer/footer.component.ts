import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: [],
})
export class FooterComponent implements OnInit {
  appVersion = '0.0.0';

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void {
    this.appVersion = this.electronService.getVersion;
  }
}
