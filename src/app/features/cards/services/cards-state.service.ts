import { Injectable, inject, signal } from '@angular/core';
import { tap, catchError, Observable, throwError } from 'rxjs';
import { CardsApiService } from './cards-api.service';
import { CardResponse, CreateCardRequest, UpdateCardRequest } from '../models/card.model';

@Injectable({
  providedIn: 'root',
})
export class CardsStateService {
  private readonly api = inject(CardsApiService);

  readonly cards = signal<CardResponse[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  loadCards(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getAll().subscribe({
      next: (cards) => {
        this.cards.set(cards);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Erro ao carregar cartões.');
        this.loading.set(false);
      },
    });
  }

  createCard(request: CreateCardRequest): Observable<CardResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.create(request).pipe(
      tap((created) => {
        this.cards.update((current) => [...current, created]);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao criar cartão.');
        return throwError(() => err);
      }),
    );
  }

  updateCard(id: string, request: UpdateCardRequest): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.update(id, request).pipe(
      tap(() => {
        this.cards.update((current) =>
          current.map((c) => (c.id === id ? { ...c, ...request } : c)),
        );
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao atualizar cartão.');
        return throwError(() => err);
      }),
    );
  }

  deleteCard(id: string): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.api.delete(id).pipe(
      tap(() => {
        this.cards.update((current) => current.filter((c) => c.id !== id));
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erro ao excluir cartão.');
        return throwError(() => err);
      }),
    );
  }
}
