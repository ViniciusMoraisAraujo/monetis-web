import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { SubscriptionsApiService } from './subscriptions-api.service';
import {
  CreateSubscriptionRequest,
  SubscriptionResponse,
  UpdateSubscriptionRequest,
} from '../models/subscription.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsStateService {
  private readonly api = inject(SubscriptionsApiService);

  readonly subscriptions = signal<SubscriptionResponse[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly activeSubscriptionsCount = computed(
    () => this.subscriptions().filter((s) => s.isActive).length,
  );

  readonly totalActiveAmount = computed(() =>
    this.subscriptions()
      .filter((s) => s.isActive)
      .reduce((sum, item) => sum + item.amount, 0),
  );

  loadSubscriptions(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getAll().subscribe({
      next: (items) => {
        this.subscriptions.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Erro ao carregar assinaturas.');
        this.loading.set(false);
      },
    });
  }

  createSubscription(request: CreateSubscriptionRequest): Observable<SubscriptionResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.create(request).pipe(
      tap((created) => {
        this.subscriptions.update((current) => [created, ...current]);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao cadastrar assinatura.');
        return throwError(() => err);
      }),
    );
  }

  updateSubscription(id: string, request: UpdateSubscriptionRequest): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.update(id, request).pipe(
      tap(() => {
        this.subscriptions.update((current) =>
          current.map((s) =>
            s.id === id
              ? {
                  ...s,
                  description: request.description,
                  amount: request.amount,
                  frequency: request.frequency,
                  nextDueDate: request.nextDueDate,
                  isActive: request.isActive,
                }
              : s,
          ),
        );
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao atualizar assinatura.');
        return throwError(() => err);
      }),
    );
  }

  deleteSubscription(id: string): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.delete(id).pipe(
      tap(() => {
        this.subscriptions.update((current) => current.filter((s) => s.id !== id));
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao excluir assinatura.');
        return throwError(() => err);
      }),
    );
  }
}
