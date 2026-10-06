import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { IncomesApiService } from './incomes-api.service';
import {
  CreateIncomeRequest,
  IncomeFilterParams,
  IncomeResponse,
  ReceiveIncomeRequest,
  UpdateIncomeRequest,
} from '../models/income.model';

@Injectable({
  providedIn: 'root',
})
export class IncomesStateService {
  private readonly api = inject(IncomesApiService);

  readonly incomes = signal<IncomeResponse[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly totalAmount = computed(() =>
    this.incomes().reduce((sum, item) => sum + item.amount, 0),
  );

  readonly receivedAmount = computed(() =>
    this.incomes()
      .filter((item) => item.isReceived)
      .reduce((sum, item) => sum + item.amount, 0),
  );

  readonly pendingAmount = computed(() =>
    this.incomes()
      .filter((item) => !item.isReceived)
      .reduce((sum, item) => sum + item.amount, 0),
  );

  loadIncomes(filters?: IncomeFilterParams): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getAll(filters).subscribe({
      next: (items) => {
        this.incomes.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Erro ao carregar receitas.');
        this.loading.set(false);
      },
    });
  }

  createIncome(request: CreateIncomeRequest): Observable<IncomeResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.create(request).pipe(
      tap((created) => {
        this.incomes.update((current) => [created, ...current]);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao cadastrar receita.');
        return throwError(() => err);
      }),
    );
  }

  updateIncome(id: string, request: UpdateIncomeRequest): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.update(id, request).pipe(
      tap(() => {
        this.incomes.update((current) =>
          current.map((i) =>
            i.id === id
              ? {
                  ...i,
                  description: request.description,
                  amount: request.amount,
                  date: request.date,
                  categoryId: request.categoryId,
                  accountId: request.accountId,
                }
              : i,
          ),
        );
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao atualizar receita.');
        return throwError(() => err);
      }),
    );
  }

  receiveIncome(id: string, request?: ReceiveIncomeRequest): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.receive(id, request).pipe(
      tap(() => {
        this.incomes.update((current) =>
          current.map((i) =>
            i.id === id
              ? {
                  ...i,
                  isReceived: true,
                  receivedAt: request?.receivedAt ?? new Date().toISOString(),
                }
              : i,
          ),
        );
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao confirmar recebimento de receita.');
        return throwError(() => err);
      }),
    );
  }

  deleteIncome(id: string): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.delete(id).pipe(
      tap(() => {
        this.incomes.update((current) => current.filter((i) => i.id !== id));
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao excluir receita.');
        return throwError(() => err);
      }),
    );
  }
}
