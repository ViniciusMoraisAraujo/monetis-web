import { Routes } from '@angular/router';

export const ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/account-list/account-list.component').then(
        (m) => m.AccountListComponent,
      ),
  },
];
