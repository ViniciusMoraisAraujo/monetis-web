import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SubscriptionsApiService } from './subscriptions-api.service';
import { environment } from '../../../../environments/environment';
import {
  CreateSubscriptionRequest,
  SubscriptionResponse,
  UpdateSubscriptionRequest,
} from '../models/subscription.model';
import { Frequency, PaymentMethod } from '../../../shared/models/enums';

describe('SubscriptionsApiService', () => {
  let service: SubscriptionsApiService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/Subscriptions`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubscriptionsApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(SubscriptionsApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should list all subscriptions via GET /api/Subscriptions', () => {
    const mockSubscriptions: SubscriptionResponse[] = [
      {
        id: 'sub-1',
        description: 'Netflix',
        amount: 55.9,
        frequency: Frequency.Monthly,
        nextDueDate: '2026-11-01T00:00:00Z',
        isActive: true,
      },
      {
        id: 'sub-2',
        description: 'Spotify',
        amount: 21.9,
        frequency: Frequency.Monthly,
        nextDueDate: '2026-11-05T00:00:00Z',
        isActive: true,
      },
    ];

    service.getAll().subscribe((res) => {
      expect(res).toEqual(mockSubscriptions);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockSubscriptions);
  });

  it('should get subscription by id via GET /api/Subscriptions/{id}', () => {
    const mockSub: SubscriptionResponse = {
      id: 'sub-1',
      description: 'Netflix',
      amount: 55.9,
      frequency: Frequency.Monthly,
      nextDueDate: '2026-11-01T00:00:00Z',
      isActive: true,
    };

    service.getById('sub-1').subscribe((res) => {
      expect(res).toEqual(mockSub);
    });

    const req = httpTesting.expectOne(`${baseUrl}/sub-1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSub);
  });

  it('should create subscription via POST /api/Subscriptions', () => {
    const request: CreateSubscriptionRequest = {
      accountId: 'acc-1',
      categoryId: 'cat-1',
      amount: 34.9,
      description: 'Amazon Prime',
      frequency: Frequency.Monthly,
      nextDueDate: '2026-11-10T00:00:00Z',
      paymentMethod: PaymentMethod.CreditCard,
    };

    const mockResponse: SubscriptionResponse = {
      id: 'sub-3',
      description: 'Amazon Prime',
      amount: 34.9,
      frequency: Frequency.Monthly,
      nextDueDate: '2026-11-10T00:00:00Z',
      isActive: true,
    };

    service.create(request).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockResponse);
  });

  it('should update subscription via PUT /api/Subscriptions/{id}', () => {
    const request: UpdateSubscriptionRequest = {
      description: 'Netflix 4K',
      amount: 69.9,
      frequency: Frequency.Monthly,
      nextDueDate: '2026-11-01T00:00:00Z',
      isActive: true,
    };

    service.update('sub-1', request).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/sub-1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(null);
  });

  it('should delete subscription via DELETE /api/Subscriptions/{id}', () => {
    service.delete('sub-1').subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/sub-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
