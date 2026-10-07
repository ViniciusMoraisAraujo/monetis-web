import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { TransfersApiService } from './transfers-api.service';
import {
  CreateTransferRequest,
  TransferFilterParams,
  TransferResponse,
} from '../models/transfer.model';

@Injectable({
  providedIn: 'root',
})
export class TransfersStateService {
  private readonly api = inject(TransfersApiService);

  readonly transfers = signal<TransferResponse[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly totalTransferred = computed(() =>
    this.transfers().reduce((sum, item) => sum + item.amount, 0),
  );

  loadTransfers(filters?: TransferFilterParams): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getAll(filters).subscribe({
      next: (items) => {
        this.transfers.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Erro ao carregar transferências.');
        this.loading.set(false);
      },
    });
  }

  createTransfer(request: CreateTransferRequest): Observable<TransferResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.create(request).pipe(
      tap((created) => {
        this.transfers.update((current) => [created, ...current]);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao realizar transferência.');
        return throwError(() => err);
      }),
    );
  }

  deleteTransfer(id: string): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.delete(id).pipe(
      tap(() => {
        this.transfers.update((current) => current.filter((t) => t.id !== id));
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao estornar transferência.');
        return throwError(() => err);
      }),
    );
  }
}
