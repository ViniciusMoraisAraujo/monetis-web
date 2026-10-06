import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateTransferRequest, TransferFilterParams, TransferResponse } from '../models/transfer.model';

@Injectable({
  providedIn: 'root',
})
export class TransfersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/Transfers`;

  getAll(filters?: TransferFilterParams): Observable<TransferResponse[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.startDate) {
        params = params.set('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params = params.set('endDate', filters.endDate);
      }
      if (filters.accountId) {
        params = params.set('accountId', filters.accountId);
      }
    }

    return this.http.get<TransferResponse[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<TransferResponse> {
    return this.http.get<TransferResponse>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateTransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(this.baseUrl, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
