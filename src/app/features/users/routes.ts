import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./components/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent,
      ),
  },
];
