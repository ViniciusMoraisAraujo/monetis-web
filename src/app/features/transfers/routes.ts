import { Routes } from '@angular/router';

export const TRANSFERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/transfer-list/transfer-list.component').then(
        (m) => m.TransferListComponent,
      ),
  },
];
