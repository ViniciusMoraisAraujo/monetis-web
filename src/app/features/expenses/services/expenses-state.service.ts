import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ExpensesApiService } from './expenses-api.service';
import {
  CreateExpenseRequest,
  CreateInstallmentExpenseRequest,
  ExpenseFilterParams,
  ExpenseResponse,
  PayExpenseRequest,
  UpdateExpenseRequest,
} from '../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpensesStateService {
  private readonly api = inject(ExpensesApiService);

  readonly expenses = signal<ExpenseResponse[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly totalAmount = computed(() =>
    this.expenses().reduce((sum, item) => sum + item.amount, 0),
  );

  readonly paidAmount = computed(() =>
    this.expenses()
      .filter((item) => item.isPaid)
      .reduce((sum, item) => sum + item.amount, 0),
  );

  readonly unpaidAmount = computed(() =>
    this.expenses()
      .filter((item) => !item.isPaid)
      .reduce((sum, item) => sum + item.amount, 0),
  );

  loadExpenses(filters?: ExpenseFilterParams): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getAll(filters).subscribe({
      next: (items) => {
        this.expenses.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Erro ao carregar despesas.');
        this.loading.set(false);
      },
    });
  }

  createExpense(request: CreateExpenseRequest): Observable<ExpenseResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.create(request).pipe(
      tap((created) => {
        this.expenses.update((current) => [created, ...current]);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao cadastrar despesa.');
        return throwError(() => err);
      }),
    );
  }

  createInstallments(request: CreateInstallmentExpenseRequest): Observable<ExpenseResponse[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.createInstallments(request).pipe(
      tap((createdList) => {
        this.expenses.update((current) => [...createdList, ...current]);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao cadastrar despesa parcelada.');
        return throwError(() => err);
      }),
    );
  }

  updateExpense(id: string, request: UpdateExpenseRequest): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.update(id, request).pipe(
      tap(() => {
        this.expenses.update((current) =>
          current.map((e) =>
            e.id === id
              ? {
                  ...e,
                  description: request.description,
                  amount: request.amount,
                  date: request.date,
                  categoryId: request.categoryId,
                }
              : e,
          ),
        );
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao atualizar despesa.');
        return throwError(() => err);
      }),
    );
  }

  payExpense(id: string, request: PayExpenseRequest): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.pay(id, request).pipe(
      tap(() => {
        this.expenses.update((current) =>
          current.map((e) =>
            e.id === id
              ? {
                  ...e,
                  isPaid: true,
                  paidAt: request.paidAt ?? new Date().toISOString(),
                  accountId: request.accountId ?? e.accountId,
                }
              : e,
          ),
        );
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao pagar despesa.');
        return throwError(() => err);
      }),
    );
  }

  deleteExpense(id: string): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.delete(id).pipe(
      tap(() => {
        this.expenses.update((current) => current.filter((e) => e.id !== id));
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao excluir despesa.');
        return throwError(() => err);
      }),
    );
  }
}
