import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { ExpenseListComponent } from './expense-list.component';
import { ExpensesStateService } from '../../services/expenses-state.service';
import { CategoriesStateService } from '../../../categories/services/categories-state.service';
import { ExpenseResponse } from '../../models/expense.model';
import { PaymentMethod } from '../../../../shared/models/enums';
import '../../../../core/i18n';

describe('ExpenseListComponent', () => {
  let expensesStateMock: {
    expenses: ReturnType<typeof signal<ExpenseResponse[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    error: ReturnType<typeof signal<string | null>>;
    totalAmount: ReturnType<typeof signal<number>>;
    paidAmount: ReturnType<typeof signal<number>>;
    unpaidAmount: ReturnType<typeof signal<number>>;
    loadExpenses: ReturnType<typeof vi.fn>;
    createExpense: ReturnType<typeof vi.fn>;
    createInstallments: ReturnType<typeof vi.fn>;
    updateExpense: ReturnType<typeof vi.fn>;
    payExpense: ReturnType<typeof vi.fn>;
    deleteExpense: ReturnType<typeof vi.fn>;
  };

  let categoriesStateMock: {
    categories: ReturnType<typeof signal<any[]>>;
    loadCategories: ReturnType<typeof vi.fn>;
  };

  let dialogMock: { open: ReturnType<typeof vi.fn> };

  const mockExpenses: ExpenseResponse[] = [
    {
      id: 'e-1',
      description: 'Supermercado Mensal',
      amount: 450.0,
      date: '2026-10-06T12:00:00Z',
      paymentMethod: PaymentMethod.CreditCard,
      categoryId: 'cat-1',
      categoryName: 'Alimentação',
      creditCardName: 'Nubank Ultravioleta',
      isPaid: false,
      isInstallment: false,
      isSubscription: false,
      createdAt: '2026-10-06T12:00:00Z',
    },
    {
      id: 'e-2',
      description: 'Energia Elétrica',
      amount: 180.0,
      date: '2026-10-05T12:00:00Z',
      paymentMethod: PaymentMethod.Pix,
      categoryId: 'cat-2',
      categoryName: 'Moradia',
      isPaid: true,
      paidAt: '2026-10-05T14:00:00Z',
      isInstallment: false,
      isSubscription: false,
      createdAt: '2026-10-05T12:00:00Z',
    },
  ];

  beforeEach(() => {
    expensesStateMock = {
      expenses: signal(mockExpenses),
      loading: signal(false),
      error: signal(null),
      totalAmount: signal(630.0),
      paidAmount: signal(180.0),
      unpaidAmount: signal(450.0),
      loadExpenses: vi.fn(),
      createExpense: vi.fn().mockReturnValue(of({} as ExpenseResponse)),
      createInstallments: vi.fn().mockReturnValue(of([])),
      updateExpense: vi.fn().mockReturnValue(of(undefined)),
      payExpense: vi.fn().mockReturnValue(of(undefined)),
      deleteExpense: vi.fn().mockReturnValue(of(undefined)),
    };

    categoriesStateMock = {
      categories: signal([]),
      loadCategories: vi.fn(),
    };

    dialogMock = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ExpenseListComponent],
      providers: [
        { provide: ExpensesStateService, useValue: expensesStateMock },
        { provide: CategoriesStateService, useValue: categoriesStateMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    });
  });

  it('should initialize and load expenses and categories', () => {
    const fixture = TestBed.createComponent(ExpenseListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(expensesStateMock.loadExpenses).toHaveBeenCalled();
    expect(categoriesStateMock.loadCategories).toHaveBeenCalled();
  });

  it('should open create dialog and call createExpense for single type', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () =>
        of({
          type: 'single',
          data: {
            description: 'Café',
            amount: 15,
            date: '2026-10-06T12:00:00Z',
            paymentMethod: PaymentMethod.Pix,
            categoryId: 'cat-1',
          },
        }),
    });

    const fixture = TestBed.createComponent(ExpenseListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.openCreateDialog();

    expect(expensesStateMock.createExpense).toHaveBeenCalled();
  });

  it('should open pay dialog and call payExpense when confirmed', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () =>
        of({
          accountId: 'acc-1',
          paidAt: '2026-10-06T12:00:00Z',
        }),
    });

    const fixture = TestBed.createComponent(ExpenseListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.openPayDialog(mockExpenses[0]);

    expect(expensesStateMock.payExpense).toHaveBeenCalledWith('e-1', {
      accountId: 'acc-1',
      paidAt: '2026-10-06T12:00:00Z',
    });
  });

  it('should call deleteExpense when confirmed', () => {
    const fixture = TestBed.createComponent(ExpenseListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.onDelete(mockExpenses[0]);

    expect(expensesStateMock.deleteExpense).toHaveBeenCalledWith('e-1');
  });
});
