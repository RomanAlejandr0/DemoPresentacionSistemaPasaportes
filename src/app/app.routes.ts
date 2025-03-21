import { Routes } from '@angular/router';
import { LoginPageComponent } from './componentes/login-page/login-page.component';
import { ProfilePageComponent } from './componentes/profile-page/profile-page.component';
import { PageNotFoundComponent } from './componentes/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'profile/:nomina', component: ProfilePageComponent },
  { path: '**', component: PageNotFoundComponent }
];
