import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateSubscriptionRequest,
  SubscriptionResponse,
  UpdateSubscriptionRequest,
} from '../models/subscription.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/Subscriptions`;

  getAll(): Observable<SubscriptionResponse[]> {
    return this.http.get<SubscriptionResponse[]>(this.baseUrl);
  }

  getById(id: string): Observable<SubscriptionResponse> {
    return this.http.get<SubscriptionResponse>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateSubscriptionRequest): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(this.baseUrl, request);
  }

  update(id: string, request: UpdateSubscriptionRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
