import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ExpensesStateService } from './expenses-state.service';
import { ExpensesApiService } from './expenses-api.service';
import { ExpenseResponse } from '../models/expense.model';
import { PaymentMethod } from '../../../shared/models/enums';

describe('ExpensesStateService', () => {
  let service: ExpensesStateService;
  let apiServiceMock: {
    getAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    createInstallments: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    pay: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const mockExpenses: ExpenseResponse[] = [
    {
      id: 'e-1',
      description: 'Supermercado',
      amount: 300,
      date: '2026-10-06T12:00:00Z',
      paymentMethod: PaymentMethod.CreditCard,
      categoryId: 'cat-1',
      categoryName: 'Alimentação',
      isPaid: true,
      isInstallment: false,
      isSubscription: false,
      createdAt: '2026-10-06T12:00:00Z',
    },
    {
      id: 'e-2',
      description: 'Conta de Luz',
      amount: 150,
      date: '2026-10-07T12:00:00Z',
      paymentMethod: PaymentMethod.Pix,
      categoryId: 'cat-2',
      categoryName: 'Moradia',
      isPaid: false,
      isInstallment: false,
      isSubscription: false,
      createdAt: '2026-10-06T12:00:00Z',
    },
  ];

  beforeEach(() => {
    apiServiceMock = {
      getAll: vi.fn().mockReturnValue(of(mockExpenses)),
      create: vi.fn(),
      createInstallments: vi.fn(),
      update: vi.fn(),
      pay: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [ExpensesStateService, { provide: ExpensesApiService, useValue: apiServiceMock }],
    });

    service = TestBed.inject(ExpensesStateService);
  });

  it('should initialize with empty state and load expenses', () => {
    expect(service.expenses()).toEqual([]);
    service.loadExpenses();
    expect(service.expenses()).toEqual(mockExpenses);
    expect(service.totalAmount()).toBe(450);
    expect(service.paidAmount()).toBe(300);
    expect(service.unpaidAmount()).toBe(150);
    expect(service.loading()).toBe(false);
  });

  it('should add created expense to signal list', () => {
    const created: ExpenseResponse = {
      id: 'e-3',
      description: 'Farmácia',
      amount: 80,
      date: '2026-10-06T14:00:00Z',
      paymentMethod: PaymentMethod.Cash,
      categoryId: 'cat-3',
      categoryName: 'Saúde',
      isPaid: false,
      isInstallment: false,
      isSubscription: false,
      createdAt: '2026-10-06T14:00:00Z',
    };
    apiServiceMock.create.mockReturnValue(of(created));

    service.loadExpenses();
    service
      .createExpense({
        description: 'Farmácia',
        amount: 80,
        date: '2026-10-06T14:00:00Z',
        paymentMethod: PaymentMethod.Cash,
        categoryId: 'cat-3',
      })
      .subscribe();

    expect(service.expenses().length).toBe(3);
    expect(service.totalAmount()).toBe(530);
  });

  it('should add installments to signal list on createInstallments', () => {
    const installments: ExpenseResponse[] = [
      {
        id: 'inst-1',
        description: 'Celular (1/2)',
        amount: 500,
        date: '2026-10-10T00:00:00Z',
        paymentMethod: PaymentMethod.CreditCard,
        categoryId: 'cat-1',
        categoryName: 'Geral',
        isPaid: false,
        isInstallment: true,
        installmentNumber: 1,
        totalInstallments: 2,
        isSubscription: false,
        createdAt: '2026-10-06T00:00:00Z',
      },
      {
        id: 'inst-2',
        description: 'Celular (2/2)',
        amount: 500,
        date: '2026-11-10T00:00:00Z',
        paymentMethod: PaymentMethod.CreditCard,
        categoryId: 'cat-1',
        categoryName: 'Geral',
        isPaid: false,
        isInstallment: true,
        installmentNumber: 2,
        totalInstallments: 2,
        isSubscription: false,
        createdAt: '2026-10-06T00:00:00Z',
      },
    ];
    apiServiceMock.createInstallments.mockReturnValue(of(installments));

    service.loadExpenses();
    service
      .createInstallments({
        description: 'Celular',
        totalAmount: 1000,
        totalInstallments: 2,
        firstDueDate: '2026-10-10T00:00:00Z',
        paymentMethod: PaymentMethod.CreditCard,
        categoryId: 'cat-1',
      })
      .subscribe();

    expect(service.expenses().length).toBe(4);
    expect(service.totalAmount()).toBe(1450);
  });

  it('should update expense in signal list', () => {
    apiServiceMock.update.mockReturnValue(of(undefined));

    service.loadExpenses();
    service
      .updateExpense('e-1', {
        description: 'Supermercado Mensal',
        amount: 320,
        date: '2026-10-06T12:00:00Z',
        categoryId: 'cat-1',
      })
      .subscribe();

    const updated = service.expenses().find((e) => e.id === 'e-1');
    expect(updated?.description).toBe('Supermercado Mensal');
    expect(updated?.amount).toBe(320);
    expect(service.totalAmount()).toBe(470);
  });

  it('should mark expense as paid on payExpense', () => {
    apiServiceMock.pay.mockReturnValue(of(undefined));

    service.loadExpenses();
    service.payExpense('e-2', { accountId: 'acc-1' }).subscribe();

    const paid = service.expenses().find((e) => e.id === 'e-2');
    expect(paid?.isPaid).toBe(true);
    expect(service.paidAmount()).toBe(450);
    expect(service.unpaidAmount()).toBe(0);
  });

  it('should remove expense on deleteExpense', () => {
    apiServiceMock.delete.mockReturnValue(of(undefined));

    service.loadExpenses();
    service.deleteExpense('e-2').subscribe();

    expect(service.expenses().length).toBe(1);
    expect(service.totalAmount()).toBe(300);
  });

  it('should set error on load failure', () => {
    apiServiceMock.getAll.mockReturnValue(
      throwError(() => ({ message: 'Failed to load expenses' })),
    );

    service.loadExpenses();

    expect(service.error()).toBe('Failed to load expenses');
    expect(service.loading()).toBe(false);
  });
});
