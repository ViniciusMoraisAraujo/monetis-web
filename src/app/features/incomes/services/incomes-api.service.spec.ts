import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IncomesApiService } from './incomes-api.service';
import { environment } from '../../../../environments/environment';
import {
  CreateIncomeRequest,
  IncomeResponse,
  ReceiveIncomeRequest,
  UpdateIncomeRequest,
} from '../models/income.model';

describe('IncomesApiService', () => {
  let service: IncomesApiService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/Incomes`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IncomesApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(IncomesApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should list incomes with query params', () => {
    const mockIncomes: IncomeResponse[] = [
      {
        id: 'inc-1',
        description: 'Salário',
        amount: 5000,
        date: '2026-10-05T00:00:00Z',
        categoryId: 'cat-salario',
        categoryName: 'Salário',
        accountId: 'acc-1',
        accountName: 'Nubank',
        isReceived: true,
        isSubscription: false,
        createdAt: '2026-10-01T00:00:00Z',
      },
    ];

    service.getAll({ categoryId: 'cat-salario', isReceived: true }).subscribe((res) => {
      expect(res).toEqual(mockIncomes);
    });

    const req = httpTesting.expectOne(
      (r) =>
        r.url === baseUrl &&
        r.params.get('categoryId') === 'cat-salario' &&
        r.params.get('isReceived') === 'true',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockIncomes);
  });

  it('should create income via POST /api/Incomes', () => {
    const request: CreateIncomeRequest = {
      description: 'Freelance',
      amount: 1200,
      date: '2026-10-10T00:00:00Z',
      categoryId: 'cat-extra',
      accountId: 'acc-1',
    };
    const mockResponse: IncomeResponse = {
      id: 'inc-2',
      description: 'Freelance',
      amount: 1200,
      date: '2026-10-10T00:00:00Z',
      categoryId: 'cat-extra',
      categoryName: 'Extras',
      accountId: 'acc-1',
      accountName: 'Nubank',
      isReceived: false,
      isSubscription: false,
      createdAt: '2026-10-06T00:00:00Z',
    };

    service.create(request).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockResponse);
  });

  it('should update income via PUT /api/Incomes/{id}', () => {
    const request: UpdateIncomeRequest = {
      description: 'Freelance Final',
      amount: 1500,
      date: '2026-10-10T00:00:00Z',
      categoryId: 'cat-extra',
      accountId: 'acc-1',
    };

    service.update('inc-2', request).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/inc-2`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(null);
  });

  it('should mark income as received via POST /api/Incomes/{id}/receive', () => {
    const request: ReceiveIncomeRequest = { receivedAt: '2026-10-10T15:00:00Z' };

    service.receive('inc-2', request).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/inc-2/receive`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(null);
  });

  it('should delete income via DELETE /api/Incomes/{id}', () => {
    service.delete('inc-2').subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/inc-2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
