import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AccountResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/Accounts`;

  getAll(): Observable<AccountResponse[]> {
    return this.http.get<AccountResponse[]>(this.baseUrl);
  }

  getById(id: string): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateAccountRequest): Observable<AccountResponse> {
    return this.http.post<AccountResponse>(this.baseUrl, request);
  }

  update(id: string, request: UpdateAccountRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
