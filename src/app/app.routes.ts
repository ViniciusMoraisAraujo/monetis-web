import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/components/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/components/dashboard-home/dashboard-home.component').then(
            (m) => m.DashboardHomeComponent
          )
      },
      {
        path: 'accounts',
        loadChildren: () =>
          import('./features/accounts/routes').then((m) => m.ACCOUNTS_ROUTES)
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/routes').then((m) => m.CATEGORIES_ROUTES)
      },
      {
        path: 'cards',
        loadChildren: () =>
          import('./features/cards/routes').then((m) => m.CARDS_ROUTES)
      },
      {
        path: 'expenses',
        loadChildren: () =>
          import('./features/expenses/routes').then((m) => m.EXPENSES_ROUTES)
      },
      {
        path: 'incomes',
        loadChildren: () =>
          import('./features/incomes/routes').then((m) => m.INCOMES_ROUTES)
      },
      {
        path: 'transfers',
        loadChildren: () =>
          import('./features/transfers/routes').then((m) => m.TRANSFERS_ROUTES)
      },
      {
        path: 'subscriptions',
        loadChildren: () =>
          import('./features/subscriptions/routes').then((m) => m.SUBSCRIPTIONS_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
