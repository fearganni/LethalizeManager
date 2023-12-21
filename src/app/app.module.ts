import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// NgxBootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// NgxToastr
import { ToastrModule } from 'ngx-toastr';

// NgxMarkdown
import { MarkdownModule } from 'ngx-markdown';

// NgxMoment
import { MomentModule } from 'ngx-moment';

// NgSelect
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';

// Components
import {
  FooterComponent,
  HeaderComponent,
  SidebarComponent,
} from './shared/components';

// Pages
import {
  UpdatesComponent,
  UpdateComponent,
  CreditComponent,
  WelcomeComponent,
  FeaturedComponent,
  ModComponent,
  ModpackComponent,
} from './pages';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [
    AppComponent,

    // Components
    HeaderComponent,
    SidebarComponent,
    FooterComponent,

    // Pages
    UpdatesComponent,
    UpdateComponent,
    CreditComponent,

    WelcomeComponent,
    FeaturedComponent,
    ModpackComponent,
    ModComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgbModule,
    ToastrModule.forRoot({
      timeOut: 15000,
      extendedTimeOut: 2000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
      progressBar: true,
    }),
    MarkdownModule.forRoot(),
    MomentModule,
    NgSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
