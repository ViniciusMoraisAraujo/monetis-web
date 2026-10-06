import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
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
export class ExpensesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/Expenses`;

  getAll(filters?: ExpenseFilterParams): Observable<ExpenseResponse[]> {
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
      if (filters.isPaid !== undefined && filters.isPaid !== null) {
        params = params.set('isPaid', String(filters.isPaid));
      }
    }

    return this.http.get<ExpenseResponse[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ExpenseResponse> {
    return this.http.get<ExpenseResponse>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateExpenseRequest): Observable<ExpenseResponse> {
    return this.http.post<ExpenseResponse>(this.baseUrl, request);
  }

  createInstallments(request: CreateInstallmentExpenseRequest): Observable<ExpenseResponse[]> {
    return this.http.post<ExpenseResponse[]>(`${this.baseUrl}/installments`, request);
  }

  update(id: string, request: UpdateExpenseRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  pay(id: string, request: PayExpenseRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/pay`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
