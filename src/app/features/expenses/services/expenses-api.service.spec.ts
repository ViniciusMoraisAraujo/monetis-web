import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ExpensesApiService } from './expenses-api.service';
import { environment } from '../../../../environments/environment';
import {
  CreateExpenseRequest,
  CreateInstallmentExpenseRequest,
  ExpenseResponse,
  PayExpenseRequest,
  UpdateExpenseRequest,
} from '../models/expense.model';
import { PaymentMethod } from '../../../shared/models/enums';

describe('ExpensesApiService', () => {
  let service: ExpensesApiService;
  let httpTesting: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/Expenses`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExpensesApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ExpensesApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should list expenses with query parameters', () => {
    const mockExpenses: ExpenseResponse[] = [
      {
        id: '1',
        description: 'Supermercado',
        amount: 250.5,
        date: '2026-10-06T12:00:00Z',
        paymentMethod: PaymentMethod.Debit,
        categoryId: 'cat-1',
        categoryName: 'Alimentação',
        isPaid: true,
        isInstallment: false,
        isSubscription: false,
        createdAt: '2026-10-06T12:00:00Z',
      },
    ];

    service
      .getAll({ categoryId: 'cat-1', isPaid: true, startDate: '2026-10-01' })
      .subscribe((expenses) => {
        expect(expenses).toEqual(mockExpenses);
      });

    const req = httpTesting.expectOne((r) =>
      r.url === baseUrl &&
      r.params.get('categoryId') === 'cat-1' &&
      r.params.get('isPaid') === 'true' &&
      r.params.get('startDate') === '2026-10-01',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockExpenses);
  });

  it('should create a single expense via POST /api/Expenses', () => {
    const request: CreateExpenseRequest = {
      description: 'Padaria',
      amount: 35.0,
      date: '2026-10-06T08:00:00Z',
      paymentMethod: PaymentMethod.Pix,
      categoryId: 'cat-1',
    };
    const mockResponse: ExpenseResponse = {
      id: 'e-1',
      description: 'Padaria',
      amount: 35.0,
      date: '2026-10-06T08:00:00Z',
      paymentMethod: PaymentMethod.Pix,
      categoryId: 'cat-1',
      categoryName: 'Alimentação',
      isPaid: false,
      isInstallment: false,
      isSubscription: false,
      createdAt: '2026-10-06T08:00:00Z',
    };

    service.create(request).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockResponse);
  });

  it('should create installment expenses via POST /api/Expenses/installments', () => {
    const request: CreateInstallmentExpenseRequest = {
      description: 'Notebook',
      totalAmount: 3000,
      totalInstallments: 3,
      firstDueDate: '2026-10-10T00:00:00Z',
      paymentMethod: PaymentMethod.CreditCard,
      categoryId: 'cat-2',
      creditCardId: 'card-1',
    };

    const mockInstallments: ExpenseResponse[] = [
      {
        id: 'e-inst-1',
        description: 'Notebook (1/3)',
        amount: 1000,
        date: '2026-10-10T00:00:00Z',
        paymentMethod: PaymentMethod.CreditCard,
        categoryId: 'cat-2',
        categoryName: 'Tecnologia',
        creditCardId: 'card-1',
        isPaid: false,
        isInstallment: true,
        installmentNumber: 1,
        totalInstallments: 3,
        isSubscription: false,
        createdAt: '2026-10-06T12:00:00Z',
      },
    ];

    service.createInstallments(request).subscribe((res) => {
      expect(res).toEqual(mockInstallments);
    });

    const req = httpTesting.expectOne(`${baseUrl}/installments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockInstallments);
  });

  it('should update expense via PUT /api/Expenses/{id}', () => {
    const request: UpdateExpenseRequest = {
      description: 'Mercado Redux',
      amount: 199.9,
      date: '2026-10-06T10:00:00Z',
      categoryId: 'cat-1',
    };

    service.update('e-1', request).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/e-1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(null);
  });

  it('should pay expense via POST /api/Expenses/{id}/pay', () => {
    const request: PayExpenseRequest = {
      accountId: 'acc-1',
      paidAt: '2026-10-06T12:30:00Z',
    };

    service.pay('e-1', request).subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/e-1/pay`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(null);
  });

  it('should delete expense via DELETE /api/Expenses/{id}', () => {
    service.delete('e-1').subscribe();

    const req = httpTesting.expectOne(`${baseUrl}/e-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
