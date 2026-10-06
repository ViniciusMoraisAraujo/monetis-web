import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
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
export class IncomesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/Incomes`;

  getAll(filters?: IncomeFilterParams): Observable<IncomeResponse[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.startDate) {
        params = params.set('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params = params.set('endDate', filters.endDate);
      }
      if (filters.categoryId) {
        params = params.set('categoryId', filters.categoryId);
      }
      if (filters.accountId) {
        params = params.set('accountId', filters.accountId);
      }
      if (filters.isReceived !== undefined && filters.isReceived !== null) {
        params = params.set('isReceived', String(filters.isReceived));
      }
    }

    return this.http.get<IncomeResponse[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<IncomeResponse> {
    return this.http.get<IncomeResponse>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateIncomeRequest): Observable<IncomeResponse> {
    return this.http.post<IncomeResponse>(this.baseUrl, request);
  }

  update(id: string, request: UpdateIncomeRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  receive(id: string, request?: ReceiveIncomeRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/receive`, request ?? {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
