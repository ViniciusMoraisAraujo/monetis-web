import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CardResponse, CreateCardRequest, UpdateCardRequest } from '../models/card.model';

@Injectable({
  providedIn: 'root',
})
export class CardsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/Cards`;

  getAll(): Observable<CardResponse[]> {
    return this.http.get<CardResponse[]>(this.baseUrl);
  }

  create(request: CreateCardRequest): Observable<CardResponse> {
    return this.http.post<CardResponse>(this.baseUrl, request);
  }

  update(id: string, request: UpdateCardRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
