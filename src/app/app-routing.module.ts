import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './shared/components';

import {
  HomeComponent,
  DevelopmentComponent,
  CreditsComponent,
  ModsComponent,
  ModComponent,
  FeaturedComponent,
  UpdatesComponent,
} from './pages';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'Home',
    },
  },
  {
    path: 'development',
    component: DevelopmentComponent,
    data: {
      title: 'Developer Updates',
    },
  },
  {
    path: 'credits',
    component: CreditsComponent,
    data: {
      title: 'Credits',
    },
  },

  {
    path: 'featured',
    component: FeaturedComponent,
    data: {
      title: 'Featured',
    },
  },
  {
    path: 'mods',
    component: ModsComponent,
    data: {
      title: 'Mods',
    },
  },
  {
    path: 'mod/:owner/:name',
    component: ModComponent,
    data: {
      title: 'Mod',
    },
  },
  {
    path: 'updates',
    component: UpdatesComponent,
    data: {
      title: 'Updates',
    },
  },

  // Error page
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
