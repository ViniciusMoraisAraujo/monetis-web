import { Routes } from '@angular/router';

export const INCOMES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/income-list/income-list.component').then((m) => m.IncomeListComponent),
  },
];
