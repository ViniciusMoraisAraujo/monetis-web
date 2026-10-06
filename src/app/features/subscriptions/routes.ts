import { Routes } from '@angular/router';

export const SUBSCRIPTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/subscription-list/subscription-list.component').then(
        (m) => m.SubscriptionListComponent,
      ),
  },
];
