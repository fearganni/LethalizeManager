import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import {
  UpdatesComponent,
  UpdateComponent,
  ModComponent,
  ModpackComponent,
  WelcomeComponent,
} from './pages';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: WelcomeComponent,
    data: {
      title: 'Home',
    },
  },
  {
    path: 'development',
    component: UpdatesComponent,
    data: {
      title: 'Developer Updates',
    },
  },

  {
    path: 'mods',
    component: ModComponent,
    data: {
      title: 'Mods',
    },
  },
  {
    path: 'pack',
    component: ModpackComponent,
    data: {
      title: 'Pack',
    },
  },
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
