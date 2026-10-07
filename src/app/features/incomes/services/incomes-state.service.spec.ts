import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { IncomesStateService } from './incomes-state.service';
import { IncomesApiService } from './incomes-api.service';
import { IncomeResponse } from '../models/income.model';

describe('IncomesStateService', () => {
  let service: IncomesStateService;
  let apiServiceMock: {
    getAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    receive: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const mockIncomes: IncomeResponse[] = [
    {
      id: 'i-1',
      description: 'Salário CLT',
      amount: 4500,
      receivedAt: '2026-10-05T00:00:00Z',
      date: '2026-10-05T00:00:00Z',
      categoryId: 'cat-1',
      categoryName: 'Salário',
      accountId: 'acc-1',
      accountName: 'Banco do Brasil',
      isReceived: true,
      isSubscription: false,
      createdAt: '2026-10-01T00:00:00Z',
    },
    {
      id: 'i-2',
      description: 'Consultoria',
      amount: 1500,
      receivedAt: '2026-10-15T00:00:00Z',
      date: '2026-10-15T00:00:00Z',
      categoryId: 'cat-2',
      categoryName: 'Extra',
      accountId: 'acc-1',
      accountName: 'Banco do Brasil',
      isReceived: false,
      isSubscription: false,
      createdAt: '2026-10-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    apiServiceMock = {
      getAll: vi.fn().mockReturnValue(of(mockIncomes)),
      create: vi.fn(),
      update: vi.fn(),
      receive: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [IncomesStateService, { provide: IncomesApiService, useValue: apiServiceMock }],
    });

    service = TestBed.inject(IncomesStateService);
  });

  it('should initialize with empty state and load incomes with computed amounts', () => {
    expect(service.incomes()).toEqual([]);
    service.loadIncomes();

    expect(service.incomes()).toEqual(mockIncomes);
    expect(service.totalAmount()).toBe(6000);
    expect(service.receivedAmount()).toBe(4500);
    expect(service.pendingAmount()).toBe(1500);
    expect(service.loading()).toBe(false);
  });

  it('should add created income to signal list', () => {
    const created: IncomeResponse = {
      id: 'i-3',
      description: 'Dividendos',
      amount: 200,
      receivedAt: '2026-10-20T00:00:00Z',
      date: '2026-10-20T00:00:00Z',
      categoryId: 'cat-3',
      categoryName: 'Investimentos',
      accountId: 'acc-1',
      accountName: 'Banco do Brasil',
      isReceived: false,
      isSubscription: false,
      createdAt: '2026-10-06T00:00:00Z',
    };
    apiServiceMock.create.mockReturnValue(of(created));

    service.loadIncomes();
    service
      .createIncome({
        description: 'Dividendos',
        amount: 200,
        receivedAt: '2026-10-20T00:00:00Z',
        categoryId: 'cat-3',
        accountId: 'acc-1',
      })
      .subscribe();

    expect(service.incomes().length).toBe(3);
    expect(service.totalAmount()).toBe(6200);
    expect(service.pendingAmount()).toBe(1700);
  });

  it('should update income in signal list', () => {
    apiServiceMock.update.mockReturnValue(of(undefined));

    service.loadIncomes();
    service
      .updateIncome('i-2', {
        description: 'Consultoria Premium',
        amount: 2000,
        receivedAt: '2026-10-15T00:00:00Z',
        categoryId: 'cat-2',
        accountId: 'acc-1',
      })
      .subscribe();

    const updated = service.incomes().find((i) => i.id === 'i-2');
    expect(updated?.description).toBe('Consultoria Premium');
    expect(updated?.amount).toBe(2000);
    expect(service.totalAmount()).toBe(6500);
  });

  it('should mark income as received in signal list', () => {
    apiServiceMock.receive.mockReturnValue(of(undefined));

    service.loadIncomes();
    service.receiveIncome('i-2').subscribe();

    const received = service.incomes().find((i) => i.id === 'i-2');
    expect(received?.isReceived).toBe(true);
    expect(service.receivedAmount()).toBe(6000);
    expect(service.pendingAmount()).toBe(0);
  });

  it('should delete income from signal list', () => {
    apiServiceMock.delete.mockReturnValue(of(undefined));

    service.loadIncomes();
    service.deleteIncome('i-2').subscribe();

    expect(service.incomes().length).toBe(1);
    expect(service.totalAmount()).toBe(4500);
  });

  it('should handle error when loadIncomes fails', () => {
    apiServiceMock.getAll.mockReturnValue(throwError(() => ({ message: 'Erro de rede' })));

    service.loadIncomes();

    expect(service.error()).toBe('Erro de rede');
    expect(service.loading()).toBe(false);
  });
});
